import BillingForm from '@/components/BillingForm';
import { getUserSubscriptionPlan } from '@/lib/stripe';

const Page = async () => {
  const subsciptionPlan = await getUserSubscriptionPlan();

  console.log(subsciptionPlan);
  return <BillingForm subsciptionPlan={subsciptionPlan} />;
};

export default Page;
