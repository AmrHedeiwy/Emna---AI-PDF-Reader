import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { ExtendedMessage } from '@/types/message';
import { useMutation } from '@tanstack/react-query';
import React, { createContext, useRef, useState } from 'react';
import { toast } from 'sonner';

export type TChatContext = {
  addMessage: () => void;
  message: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<TChatContext>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false
});

interface ChatProps {
  fileId: string;
  children: React.ReactNode;
}

export const ChatProvider = ({ fileId, children }: ChatProps) => {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const backupMessage = useRef<string>('');
  const dashboardCtx = trpc.useUtils().dashboard;

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const res = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message
        })
      });

      if (!res.ok) throw new Error('Failed to send message');

      return res.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage('');

      await dashboardCtx.getFileMessages.cancel();

      let prevState: any = null;

      dashboardCtx.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (prevData: any) => {
          prevState = prevData;
          const newMsgObj = {
            id: crypto.randomUUID(),
            content: message,
            createdAt: new Date().toISOString(),
            isUserMessage: true
          };
          if (!prevData || !prevData.pages || prevData.pages.length === 0)
            return {
              pages: [
                {
                  messages: [newMsgObj]
                }
              ],
              pageParams: []
            };

          const newData = [...prevData.pages];

          newData[0] = {
            ...newData[0],
            messages: [newMsgObj, ...newData[0].messages]
          };

          return { ...prevData, pages: newData };
        }
      );

      setIsLoading(true);

      return { prevState };
    },
    onSuccess: async (stream) => {
      if (!stream)
        return toast.error(
          'There was a problem sending this message. Please refresh this page and try again.'
        );

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        const chunkVal = decoder.decode(value);

        dashboardCtx.getFileMessages.setInfiniteData({ fileId }, (prevData: any) => {
          if (!prevData || !prevData.pages || prevData.pages.length === 0)
            return {
              pageParams: [],
              pages: []
            };

          const newData = [...prevData.pages];

          const isAIResponseExist = newData[0].messages[0].id === 'ai-response';

          newData[0] = {
            ...newData[0],
            messages: isAIResponseExist
              ? [
                  {
                    ...newData[0].messages[0],
                    content: newData[0].messages[0].content + chunkVal
                  },
                  ...newData[0].messages.slice(1)
                ]
              : [
                  {
                    id: 'ai-response',
                    content: chunkVal,
                    isUserMessage: false,
                    createdAt: new Date().toISOString()
                  },
                  ...newData[0].messages
                ]
          };

          return { ...prevData, pages: newData };
        });

        if (done) break;
      }
    },
    onError: (_, __, ctx) => {
      setMessage(backupMessage.current);
      dashboardCtx.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        ctx?.prevState
      );
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value.trim());
  };

  return (
    <ChatContext.Provider
      value={{
        message,
        addMessage: () => sendMessage({ message }),
        handleInputChange,
        isLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
