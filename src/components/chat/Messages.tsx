'use client';

import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from './ChatContext';
import { Loader2, MessageSquare } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import Message from './Message';
import { useIntersection } from '@mantine/hooks';

const Messages = ({ fileId }: { fileId: string }) => {
  const { isAIThinking } = useContext(ChatContext);

  const { data, fetchNextPage, isLoading } =
    trpc.dashboard.getFileMessages.useInfiniteQuery(
      { fileId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    id: 'ai-loading-message',
    createdAt: new Date().toISOString(),
    content: (
      <span className="flex items-center w-full mb-0.5">
        <Skeleton className="ease-linear h-8 w-96 bg-slate-200" />
      </span>
    ),
    isUserMessage: false
  };

  const combinedMessages = [
    ...(isAIThinking ? [loadingMessage] : []),
    ...(messages ?? [])
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({ root: lastMessageRef.current, threshold: 1 });
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isAIThinking) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isAIThinking, bottomRef]);

  return (
    <div className="flex-1 flex flex-col-reverse py-4 p-3 max-h-[calc(100vh-9.2rem)] overflow-y-auto overflow-x-hidden border-zinc-200 scrollable-content">
      {(!combinedMessages || combinedMessages.length <= 0) &&
        (isLoading ? (
          <div className="flex flex-col w-full items-center gap-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <MessageSquare className="w-8 h-8 text-green-500" />
            <h1 className="text-xl text-zinc-900 font-medium">You&apos;re all set!</h1>
            <p className="text-muted-foreground text-sm">
              Ask your first question to get started!
            </p>
          </div>
        ))}

      <div ref={bottomRef} />

      {combinedMessages.map((msg, i) => {
        const isNextMessageSameSender =
          combinedMessages[i - 1]?.isUserMessage === msg.isUserMessage;

        return (
          <Message
            ref={i === combinedMessages.length - 1 ? ref : null}
            key={msg.id}
            message={msg}
            isNextMessageSameSender={isNextMessageSameSender}
          />
        );
      })}
    </div>
  );
};

export default Messages;
