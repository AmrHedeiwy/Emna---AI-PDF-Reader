import Dashboard from '@/components/Dashboard';
import { getUserSubscription } from '@/lib/stripe';

const Page = async () => {
  const subscription = await getUserSubscription();

  return <Dashboard subscription={subscription} />;
};

export default Page;
