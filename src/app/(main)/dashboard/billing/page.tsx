import BillingForm from '@/components/BillingForm';
import { getUserSubscriptionPlan } from '@/lib/stripe';

const Page = async () => {
  const subsciptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subsciptionPlan={subsciptionPlan} />;
};

export default Page;
