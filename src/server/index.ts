import { z } from 'zod';
import authRouter from './routers/auth';
import { privateProcudure, router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  a: privateProcudure.input(z.object({ a: z.string() })).query(() => {
    return 'asdas';
  })
});

export type AppRouter = typeof appRouter;
