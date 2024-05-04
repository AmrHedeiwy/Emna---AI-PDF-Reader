import { router, publicProcedure } from './trpc';

import { z } from 'zod';

export const appRouter = router({
  auth: publicProcedure
    .input(z.object({ a: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log(ctx);

      return input;
    })
});

export type AppRouter = typeof appRouter;
