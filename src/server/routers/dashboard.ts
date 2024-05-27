import prisma from '@/lib/prismadb';
import { privateProcudure, router } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { PLANS } from '@/config/stripe';

const dashboardRouter = router({
  getUserFiles: privateProcudure.query(async ({ ctx }) => {
    return await prisma.file.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' }
    });
  }),
  deleteFile: privateProcudure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await prisma.file.findFirst({
        where: { id: input.id, userId: ctx.user.id }
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      await prisma.file.delete({ where: { id: input.id } });

      return { deleted: true };
    }),
  getFileUploadStatus: privateProcudure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await prisma.file.findFirst({
        where: { id: input.id, userId: ctx.user.id },
        select: { uploadStatus: true }
      });

      return { status: !file ? ('PENDING' as const) : file.uploadStatus };
    }),
  getFile: privateProcudure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await prisma.file.findFirst({
        where: { key: input.key, userId: ctx.user.id }
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      return file;
    }),
  createStripeSession: privateProcudure.mutation(async ({ ctx }) => {
    const billingUrl = absoluteUrl('/dashboard/billing');

    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const user = await prisma.user.findUnique({ where: { id: ctx.user.id } });

    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
      const subscriptionPlan = await getUserSubscriptionPlan();

      if (subscriptionPlan.isSubscribed) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId!,
          return_url: billingUrl
        });

        return { url: stripeSession.url };
      }

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ['card'],
        mode: 'subscription',
        metadata: {
          userId: user.id
        },
        line_items: [
          {
            price: PLANS.find((p) => p.slug === 'pro')?.price.priceIds.test,
            quantity: 1,
            adjustable_quantity: { enabled: false }
          }
        ]
      });

      return { url: stripeSession.url };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }
  }),
  getFileMessages: privateProcudure
    .input(
      z.object({
        fileId: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const { fileId, cursor, limit } = input;

      const messages = await prisma.message.findMany({
        where: { fileId },
        cursor: cursor ? { id: cursor } : undefined,
        take: (limit ?? INFINITE_QUERY_LIMIT) + 1,
        orderBy: { createdAt: 'desc' },
        select: { id: true, content: true, isUserMessage: true, createdAt: true }
      });

      let nextCursor: typeof cursor = null;

      if (limit && messages.length > limit) {
        nextCursor = messages.pop()?.id;
      }

      return { messages, nextCursor };
    })
});

export default dashboardRouter;
