import { appRouter } from '@/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    req,
    endpoint: '/api/trpc',
    router: appRouter,
    createContext: ({}) => ({})
  });

export { handler as GET, handler as POST };

export const maxDuration = 1000 * 60 * 5;
