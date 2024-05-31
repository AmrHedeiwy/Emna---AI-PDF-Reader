import { indexFile } from '@/lib/pinecone';
import prisma from '@/lib/prismadb';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { getUserSubscription, stripe } from '@/lib/stripe';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { PLANS } from '@/config/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    return new Response('Webhook Error: ' + err, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session.metadata?.userId)
    return new Response('Webhook Error: No user present in metadata', { status: 400 });

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.user.update({
      where: { id: session.metadata.userId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'invoice.payment_succeeded'
  ) {
    const failedFiles = await prisma.file.findMany({
      where: { userId: session.metadata.userId, uploadStatus: 'FAILED' },
      select: { id: true, url: true }
    });

    for (const { id, url } of failedFiles) {
      try {
        await indexFile(url, id, await getUserSubscription(session.metadata.userId));

        await prisma.file.update({
          where: { id },
          data: { uploadStatus: 'SUCCESS' }
        });
      } catch (error) {
        console.log('error fro' + error);
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const user = await prisma.user.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (!user) return new Response(null, { status: 200 });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: null,
        stripeCustomerId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null
      }
    });

    const files = await prisma.file.findMany({
      where: { userId: user.id, uploadStatus: 'SUCCESS' }
    });

    for (const { id, url } of files) {
      const res = await fetch(url);

      const blob = await res.blob();

      const loader = new PDFLoader(blob);

      const doc = await loader.load();

      if (doc.length > PLANS.find((p) => p.slug === 'free')?.pagesPerPdf!) {
        await prisma.file.update({
          where: { id },
          data: { uploadStatus: 'FAILED' }
        });
      }
    }
  }

  return new Response(null, { status: 200 });
}
