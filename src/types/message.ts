import { AppRouter } from '@/server';
import { inferRouterOutputs } from '@trpc/server';

type RouterOutputs = inferRouterOutputs<AppRouter>;

type Messages = RouterOutputs['dashboard']['getFileMessages']['messages'];

type OmitContent = Omit<Messages[number], 'content'>;

type ExtentedContent = { content: string | JSX.Element };

export type ExtendedMessage = OmitContent & ExtentedContent;
