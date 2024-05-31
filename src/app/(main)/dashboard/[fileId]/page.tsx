import ChatWrapper from '@/components/chat/ChatWrapper';
import PdfRenderer from '@/components/PdfRenderer';

import prisma from '@/lib/prismadb';
import { getUserSubscription } from '@/lib/stripe';
import authOptions from '@/server/authOptions';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    fileId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);

  const file = await prisma.file.findFirst({
    where: { id: params.fileId, userId: session?.user.id }
  });

  const subscription = await getUserSubscription();

  if (!file) return notFound();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] border-t border-gray-200">
      <div className="mx-auto w-full grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 xl:px-6 xl:flex-1">
            <PdfRenderer url={file.url} />
          </div>
        </div>
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:border-l lg:border-t-0">
          <ChatWrapper isSubscribed={subscription.isSubscribed} fileId={params.fileId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
