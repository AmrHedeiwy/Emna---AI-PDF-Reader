'use client';

import { trpc } from '@/app/_trpc/client';
import { TGetUserSubscription } from '@/lib/stripe';
import { toast } from 'sonner';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const BillingForm = ({ subscription }: { subscription: TGetUserSubscription }) => {
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
              You are currently on the <strong>{subscription.plan?.name}</strong> plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-6 md:space-y-2 md:flex-row md:justify-between md">
            <Button type="submit">
              {isPending && <Loader2 className="w-4 h-4 mr-4 animate-spin" />}
              {subscription.isSubscribed ? 'Manage Subscription' : 'Upgrade to PRO'}
            </Button>

            {subscription.isSubscribed && (
              <p className="text-sm py-1 px-2 font-medium text-muted-foreground">
                {subscription.isCanceled
                  ? 'Your plan will be canceled on'
                  : 'Your plan renews on'}{' '}
                {format(subscription.stripeCurrentPeriodEnd!, 'dd.MM.yyyy')}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
