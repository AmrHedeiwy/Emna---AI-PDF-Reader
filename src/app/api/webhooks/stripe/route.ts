import { indexFile } from '@/lib/pinecone';
import prisma from '@/lib/prismadb';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  console.log('sig: ' + signature, 'body: ' + body);
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
        console.log('indexing file: ' + id + ' ' + url);
        await indexFile(url, id);

        await prisma.file.update({
          where: { id },
          data: { uploadStatus: 'SUCCESS' }
        });
      } catch (error) {
        console.log('error fro' + error);
      }
    }
  }

  return new Response(null, { status: 200 });
}
