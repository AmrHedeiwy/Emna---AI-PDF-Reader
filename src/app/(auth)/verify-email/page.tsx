import { Email } from '@/components/Icons';
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
          <div className="flex flex-col h-full  items-center justify-center space-y-1 text-center">
            <Email className="w-60 h-60" />
            <h3 className="font-semibold text-2xl">Check your email</h3>

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
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
