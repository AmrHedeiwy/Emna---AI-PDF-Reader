import { CreateAccountCredentialsValidator } from '@/lib/validators/auth-credentials-validator';
import { publicProcedure, router } from '../trpc';

import primsa from '@/lib/prismadb';
import { TRPCError } from '@trpc/server';

import { z } from 'zod';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authRouter = router({
  createUser: publicProcedure
    .input(CreateAccountCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const user = await primsa.user.findUnique({ where: { email } });

      if (user) throw new TRPCError({ code: 'CONFLICT' });

      try {
        await primsa.user.create({
          data: { email, hashedPassword: await bcrypt.hash(password, 12) }
        });

        return { success: true, sentToEmail: email };
      } catch (error) {
        console.error('SAVE CREATE USER TO DATABASE: \n' + error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      let _decoded;

      try {
        _decoded = jwt.verify(input.token, process.env.JWT_SECRET!) as jwt.JwtPayload;
      } catch (error) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const user = await primsa.user.findUnique({
        where: { email: _decoded.email as string, emailVerified: { equals: null } }
      });

      // Means that use was already verified before
      if (!user) return { success: true };

      await primsa.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });

      return { success: true };
    })
});

export default authRouter;
