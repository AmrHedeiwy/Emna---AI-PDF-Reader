import { cn } from '@/lib/utils';
import { ExtendedMessage } from '@/types/message';
import { User } from 'lucide-react';
import { Logo } from '../Icons';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { forwardRef } from 'react';

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSameSender: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message: msg, isNextMessageSameSender }: MessageProps, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-end my-0.5', msg.isUserMessage && 'justify-end')}
      >
        <div
          className={cn(
            'flex items-center justify-center w-6 h-6 aspect-square rounded-sm',
            msg.isUserMessage ? 'order-2 bg-green-100' : 'order-1 bg-green-100',
            isNextMessageSameSender && 'invisible'
          )}
        >
          {msg.isUserMessage ? (
            <User className="text-green-700 h-3/4 w-3/4 " />
          ) : (
            <Logo className="h-3/4 w-3/4" />
          )}
        </div>

        <div
          className={cn(
            'flex flex-col space-y-2  max-w-md mx-2',
            msg.isUserMessage ? 'order-1 items-end' : 'order-2 items-start'
          )}
        >
          <div
            className={cn(
              'p-2 rounded-lg inline-block min-w-32',
              msg.isUserMessage ? 'order-1 bg-emerald-600' : 'order-2 bg-gray-100',
              !isNextMessageSameSender &&
                (msg.isUserMessage ? 'rounded-br-none' : 'rounded-bl-none')
            )}
          >
            {typeof msg.content === 'string' ? (
              <ReactMarkdown
                className={cn(
                  'prose',
                  msg.isUserMessage ? 'text-white' : 'text-zinc-950'
                )}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}

            {msg.id !== 'loading-message' && (
              <div
                className={cn(
                  'text-xs text-muted-foreground select-none w-full',
                  msg.isUserMessage
                    ? 'text-green-200 text-right'
                    : 'text-zinc-500 text-left'
                )}
              >
                {format(new Date(msg.createdAt), 'hh:mm')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = 'Message';

export default Message;
