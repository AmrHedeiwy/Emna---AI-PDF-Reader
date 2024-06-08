'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ArrowRight, Loader2 } from 'lucide-react';
import { Google, Logo } from '@/components/Icons';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoginCredentialsValidator,
  TLoginCredentialsValidator
} from '@/lib/validators/auth-credentials-validator';
import { signIn } from 'next-auth/react';

import { toast } from 'sonner';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [isLoading, setIsLoading] = useState(false);
  const { mutate: resendEmailVerification } =
    trpc.auth.resendEmailVerification.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TLoginCredentialsValidator>({
    resolver: zodResolver(LoginCredentialsValidator)
  });

  const onSubmit = async (data: TLoginCredentialsValidator) => {
    setIsLoading(true);
    signIn('credentials', { ...data, redirect: false }).then((res) => {
      if (res?.error) {
        if (res.error === 'INVALID_CREDENTIALS')
          toast.error('Invalid credentials', {
            description: 'Make sure your email and password are correct.'
          });
        else if (res.error === 'EMAIL_NOT_VERIFIED') {
          toast.error('Email not verified', {
            description: 'Please verify your email and try again.'
          });

          router.push(`/verify-email?to=${data.email}`);
          resendEmailVerification({ email: data.email });
        } else
          toast.error('Something went wrong', { description: 'Please try again later.' });
      } else {
        if (!!callbackUrl) router.push(callbackUrl);
        else router.push('/dashboard');

        router.refresh();
      }

      setIsLoading(false);
    });
  };

  return (
    <div className="container pt-20 flex flex-col items-center justify-center lg:px-0">
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Logo className="w-24 h-24" />
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <Link
            href="/sign-up"
            className={buttonVariants({
              variant: 'link',
              className: 'group'
            })}
          >
            Dont&apos;t have an account? Sign-up{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />{' '}
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

              <Button disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin h-6 w-6 text-zinc-300" />
                    <p className="font-semibold text-muted">Loading...</p>
                  </div>
                ) : (
                  'Sign in'
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
