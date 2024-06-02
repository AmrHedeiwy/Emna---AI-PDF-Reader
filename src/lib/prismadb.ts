import { PrismaClient } from '@prisma/client';

import mailer from './mailer';
import { EmailVerify } from '@/components/emails/EmailVerify';

import jwt from 'jsonwebtoken';

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      user: {
        async create({ args, query }) {
          const token = jwt.sign({ email: args.data.email }, process.env.JWT_SECRET!, {
            expiresIn: 60 * 1000 * 15 // 15 minutes
          });

          await mailer({
            to: args.data.email,
            subject: 'Verify Account',
            html: EmailVerify({
              actionLabel: 'verify your account',
              buttonText: 'Verify Account',
              href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
            })
          });

          return query(args);
        }
      }
    }
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
