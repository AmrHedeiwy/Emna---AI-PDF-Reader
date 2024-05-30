'use client';

import { trpc } from '@/app/_trpc/client';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { ChevronLeft, Loader2, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ChatContext, ChatProvider } from './ChatContext';
import { useEffect, useRef } from 'react';

const ChatWrapper = ({ fileId }: { fileId: string }) => {
  const { data, isLoading } = trpc.dashboard.getFileUploadStatus.useQuery(
    { id: fileId },
    {
      refetchInterval: ({ state: { data } }) =>
        data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500
    }
  );

  if (isLoading || data?.status !== 'SUCCESS')
    return (
      <div className="relative flex flex-col min-h-full items-center justify-between divide-y divide-zinc-200 gap-2">
        <div className="flex-1 flex flex-col items-center justify-center mb-28">
          <div className="flex flex-col items-center gap-2">
            {data?.status === 'FAILED' ? (
              <XCircleIcon className="text-red-500 w-8 h-8" />
            ) : (
              <Loader2 className="text-green-500 w-8 h-8 animate-spin" />
            )}

            <h3 className="font-medium text-xl">
              {(isLoading || data?.status === 'PENDING') && 'Loading...'}
              {data?.status === 'PROCESSING' && 'Processing PDF...'}
              {data?.status === 'FAILED' && 'Too many pages in PDF'}
            </h3>

            <p className="text-sm text-muted-foreground">
              {(isLoading || data?.status === 'PENDING') && "We're preparing your PDF."}
              {data?.status === 'PROCESSING' && "This won't take long."}
              {data?.status === 'FAILED' && `Your plan supports up to x pages per PDF.`}
            </p>

            {data?.status === 'FAILED' && (
              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: 'secondary',
                  className: 'mt-4 gap-1'
                })}
              >
                <ChevronLeft className="h-3 w-3 text-zinc-800" />
                Back
              </Link>
            )}
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  return (
    <ChatProvider fileId={fileId}>
      <div className="relative flex flex-col justify-between min-h-full divide-y divide-zinc-200 gap-2">
        <div className="flex-1 flex flex-col mb-[90px]">
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatProvider>
  );
};

export default ChatWrapper;
