import BillingForm from '@/components/BillingForm';
import { getUserSubscription } from '@/lib/stripe';

const Page = async () => {
  const subscription = await getUserSubscription();

  return <BillingForm subscription={subscription} />;
};

export default Page;
