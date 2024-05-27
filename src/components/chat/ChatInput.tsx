import { Key, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { TSendMessageValidator } from '@/lib/validators/send-message-validator';
import { useContext, useRef } from 'react';
import { ChatContext } from './ChatContext';

const ChatInput = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { handleInputChange, addMessage, message, isLoading } = useContext(ChatContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex md:mx-4 md:mb-2 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="flex flex-1 items-stretch h-full p-4">
          <div className="relative w-full">
            <Textarea
              ref={textAreaRef}
              rows={1}
              maxRows={4}
              autoFocus
              disabled={isDisabled}
              onChange={handleInputChange}
              value={message}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  textAreaRef.current?.value?.trim().length !== 0
                ) {
                  e.preventDefault();

                  addMessage();

                  textAreaRef.current?.focus();
                }
              }}
              className="resize-none pr-16 text-base py-3 scrollable-content"
            />
            <Button
              onClick={() => {
                if (textAreaRef.current?.value?.trim().length === 0) return;
                addMessage();

                textAreaRef.current?.focus();
              }}
              disabled={isDisabled || isLoading}
              className="absolute right-2 bottom-1"
              aria-label="send message"
            >
              <Send className="text-zinc-200 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
