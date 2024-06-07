import { CreateAccountCredentialsValidator } from '@/lib/validators/auth-credentials-validator';
import { privateProcudure, publicProcedure, router } from '../trpc';

import primsa from '@/lib/prismadb';
import { TRPCError } from '@trpc/server';

import { z } from 'zod';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mailer from '@/lib/mailer';
import { EmailVerify } from '@/components/emails/EmailVerify';

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
    }),
  resendEmailVerification: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      const user = await primsa.user.findUnique({
        where: { email: input.email, emailVerified: { equals: null } }
      });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
        expiresIn: 60 * 1000 * 15 // 15 minutes
      });

      try {
        await mailer({
          to: input.email,
          subject: 'Verify Account',
          html: EmailVerify({
            actionLabel: 'verify your account',
            buttonText: 'Verify Account',
            href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
          })
        });
      } catch (error) {
        console.error('SEND EMAIL VERIFICATION: \n' + error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
      }

      return { success: true, sentToEmail: input.email };
    }),
  deleteUser: privateProcudure.mutation(async ({ ctx }) => {
    const user = await primsa.user.findUnique({ where: { id: ctx.user!.id } });

    if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

    await primsa.user.delete({ where: { id: ctx.user!.id } });

    return { success: true };
  })
});

export default authRouter;
