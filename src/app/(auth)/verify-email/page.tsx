import { Email } from '@/components/Icons';
import ResendEmailVerification from '@/components/ResendEmailVerification';
import VerifyEmail from '@/components/VerifyEmail';

interface PageParams {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = ({ searchParams }: PageParams) => {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className="container relative pt-20 flex flex-col items-center justify-center lg:px-0">
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
        {token && typeof token === 'string' ? (
          <VerifyEmail token={token} />
        ) : (
          <div className="flex flex-col h-full items-center justify-center text-center">
            <Email className="w-60 h-60" />
            <h3 className="font-semibold text-2xl mb-2">Check your email</h3>

            {toEmail ? (
              <p className="text-muted-foreground">
                We&apos;ve sent a verification link to{' '}
                <span className="font-semibold">{toEmail}</span>
              </p>
            ) : (
              <p className="text-muted-foreground">
                We&apos;ve sent a verification link to your email.
              </p>
            )}
            <p className="text-muted-foreground italic mt-5 text-sm">
              If you don&apos;t see the email, please check your spam folder.
            </p>
            {typeof toEmail === 'string' && <ResendEmailVerification email={toEmail} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
