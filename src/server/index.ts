import authRouter from './routers/auth';
import { router } from './trpc';
import dashboardRouter from './routers/dashboard';

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter
});

export type AppRouter = typeof appRouter;
