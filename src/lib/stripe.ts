import { PLANS, TPLANS } from '@/config/stripe';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import prisma from './prismadb';
import authOptions from '@/server/authOptions';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-04-10',
  typescript: true
});

type TCurrentPlan = {
  plan: TPLANS;
  isSubscribed: boolean;
  isCanceled: boolean;
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: Date | null;
  stripeCustomerId: string | null;
};

export async function getUserSubscriptionPlan() {
  const session = await getServerSession(authOptions);

  const currentPlan: TCurrentPlan = {
    plan: { ...PLANS[0] },
    isSubscribed: false,
    isCanceled: false,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeCurrentPeriodEnd: null
  };

  if (!session?.user) return currentPlan;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) return currentPlan;

  const isSubscribed = Boolean(
    user.stripePriceId &&
      user.stripeCustomerId &&
      user.stripeSubscriptionId &&
      user.stripeCurrentPeriodEnd &&
      // 86_400_000 = 1 day (Grace period)
      user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const plan = PLANS.find((p) => p.price.priceIds.test === (user.stripePriceId ?? ''));

  if (isSubscribed) {
    const stripePlan = await stripe.subscriptions.retrieve(user.stripeSubscriptionId!);

    currentPlan.isCanceled = stripePlan.cancel_at_period_end;
  }

  currentPlan.isSubscribed = isSubscribed;
  currentPlan.plan = plan ?? PLANS[0];
  currentPlan.stripeCustomerId = user.stripeCustomerId;
  currentPlan.stripeSubscriptionId = user.stripeSubscriptionId;
  currentPlan.stripeCurrentPeriodEnd = user.stripeCurrentPeriodEnd;

  return currentPlan;
}

export type TGetUserSubscriptionPlan = Awaited<
  ReturnType<typeof getUserSubscriptionPlan>
>;
