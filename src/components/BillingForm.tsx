'use client';

import { trpc } from '@/app/_trpc/client';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { toast } from 'sonner';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'util';

const BillingForm = ({
  subsciptionPlan
}: {
  subsciptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}) => {
  const { mutate: createStripeSession, isPending } =
    trpc.dashboard.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (!url)
          return toast.error('There was a problem', {
            description: 'Please try again in a moment'
          });

        window.location.href = url;
      }
    });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subsciptionPlan.plan?.name}</strong> plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md">
            <Button type="submit">
              {isPending && <Loader2 className="w-4 h-4 mr-4 animate-spin" />}
              {subsciptionPlan.isSubscribed ? 'Manage Subscription' : 'Upgrade to PRO'}
            </Button>

            {subsciptionPlan.isSubscribed && (
              <p className="bg-gray-100 rounded-full text-sm font-medium text-zinc-800">
                {subsciptionPlan.isCanceled
                  ? 'Your plan will be canceled on'
                  : 'Your plan renews on'}{' '}
                {format(subsciptionPlan.stripeCurrentPeriodEnd!, 'dd.MM.yyy')}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
