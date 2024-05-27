import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';
import authOptions from './authOptions';

const t = initTRPC.create();
const middleware = t.middleware;

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuth = middleware(async ({ next }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return next({ ctx: { user: session?.user } });
});

export const privateProcudure = t.procedure.use(isAuth);
