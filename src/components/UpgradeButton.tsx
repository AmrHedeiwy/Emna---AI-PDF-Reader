'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from './ui/button';

const UpgradeButton = () => {
  const { mutate: createStripeSession } = trpc.dashboard.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? '/dashboard/billing';
    }
  });

  return (
    <Button className="w-full" onClick={() => createStripeSession()}>
      Upgrade now &rarr;
    </Button>
  );
};

export default UpgradeButton;
