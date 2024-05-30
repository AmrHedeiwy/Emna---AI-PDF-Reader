'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { ArrowRight, Loader2 } from 'lucide-react';
import { Google, Logo } from '@/components/Icons';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodError } from 'zod';
import {
  CreateAccountCredentialsValidator,
  TCreateAccountCredentialsValidator
} from '@/lib/validators/auth-credentials-validator';
import { signIn } from 'next-auth/react';

import { trpc } from '@/app/_trpc/client';

import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading }
  } = useForm<TCreateAccountCredentialsValidator>({
    resolver: zodResolver(CreateAccountCredentialsValidator)
  });

  const { mutate: signUp } = trpc.auth.createUser.useMutation({
    onError: (err) => {
      if (err.data?.code === 'CONFLICT') {
        toast.error('This email is already in use. Sign in instead?');
        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }

      toast.error('Something went wrong. Please try again.');
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Verification email sent to ${sentToEmail}.`);
      router.push('/verify-email?to=' + sentToEmail);
    }
  });

  const onSubmit = async (data: TCreateAccountCredentialsValidator) => {
    signUp(data);
  };

  return (
    <div className="container pt-20 flex flex-col items-center justify-center lg:px-0">
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Logo className="w-24 h-24" />
          <h1 className="text-2xl font-bold">Create an account</h1>
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: 'link',
              className: 'group'
            })}
          >
            Already have an account? Sign-in{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                />
                {!!errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-1 py-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Your password"
                />
                {!!errors.password && (
                  <p className="text-red-500 text-xs">{errors.password.message}</p>
                )}
              </div>
              <div className="grid gap-1 py-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Confirm password"
                />
                {!!errors.confirmPassword && (
                  <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin h-6 w-6 text-zinc-300" />
                    <p className="font-semibold text-muted">Loading...</p>
                  </div>
                ) : (
                  'Sign up'
                )}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <span className="border-t w-full" />
            </div>

            <div className="relative flex justify-center">
              <span className="grainy px-2 text-xs uppercase text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <div className="flex w-full">
            <Button
              className="flex w-full"
              disabled={isLoading}
              onClick={() => signIn('google', { redirect: false })}
            >
              <Google className="w-5 h-5 mr-2" /> Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
