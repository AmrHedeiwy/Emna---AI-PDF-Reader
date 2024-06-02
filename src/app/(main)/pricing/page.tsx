import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import UpgradeButton from '@/components/UpgradeButton';
import { PLANS } from '@/config/stripe';
import { cn } from '@/lib/utils';
import authOptions from '@/server/authOptions';
import { Check, HelpCircle, Minus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

const pricingItems = [
  {
    plan: 'Free',
    tagline: 'For small side projects.',
    quota: PLANS.find((p) => p.slug === 'free')!.quota,
    price: PLANS.find((p) => p.slug === 'free')!.price.amount,
    features: [
      {
        text: '10 pages per PDF',
        footnote: 'The maximum amount of pages per PDF-file.'
      },
      {
        text: '16MB file size limit',
        footnote: 'The maximum file size of a single PDF file.'
      },
      {
        text: 'Mobile-friendly interface'
      },
      {
        text: 'GPT-4o powered responses',
        footnote: 'Access to GPT-4o for generating responses with basic quality.'
      }
    ]
  },
  {
    plan: 'Pro',
    tagline: 'For larger projects with higher needs.',
    quota: PLANS.find((p) => p.slug === 'pro')!.quota,
    price: PLANS.find((p) => p.slug === 'pro')!.price.amount,
    features: [
      {
        text: '25 pages per PDF',
        footnote: 'The maximum amount of pages per PDF-file.'
      },
      {
        text: '32MB file size limit',
        footnote: 'The maximum file size of a single PDF file.'
      },
      {
        text: 'Mobile-friendly interface'
      },
      {
        text: 'Other features comming soon'
      }
    ]
  }
];

const Page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <MaxWidthWrapper className="mb-10 mt-10 max-w-5xl text-center">
      <div className="mx-auto mb-8 max-w-md">
        <h1 className="text-6xl sm:text-7xl font-bold">Pricing</h1>
        <p className="text-sm font-medium text-muted-foreground mt-5">
          Whether you&apos;re trying out our service or need more, we&apos;ve got you
          covered.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <TooltipProvider>
          {pricingItems.map(({ features, plan, quota, tagline, price }) => {
            return (
              <div
                key={plan}
                className={cn(
                  'bg-white rounded-lg border border-gray-200 shadow-lg',
                  plan === 'Pro' && 'border-2 border-green-400 shadow-green-200'
                )}
              >
                <div className="flex flex-col items-center p-4">
                  <h3 className="text-3xl font-bold mt-4 mb-2">{plan}</h3>
                  <p className="text-sm text-muted-foreground">{tagline}</p>

                  <p className="text-5xl font-semibold my-3">${price}</p>
                  <p className=" text-muted-foreground">per month</p>
                </div>

                <div className="flex h-20 my-4 items-center justify-center w-full border-b border-t bg-gray-50 border-gray-100">
                  <p className="font-medium text-sm text-muted-foreground">
                    {quota.toLocaleString()} PDFs/mo included
                  </p>

                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="cursor-default ml-1.5">
                      <HelpCircle className="h-4 w-4 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      How many PDFs you can upload per month.
                    </TooltipContent>
                  </Tooltip>
                </div>

                <ul className="my-10 space-y-5 px-8">
                  {features.map(({ text, footnote }, i) => (
                    <li key={i} className="flex space-x-5">
                      <div className="flex-shrink-0">
                        <Check className={cn('h-6 w-6 text-green-500')} />
                      </div>

                      <div className="flex items-center">
                        <p className="text-sm">{text}</p>

                        {!!footnote && (
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="cursor-default ml-1.5">
                              <HelpCircle className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              {footnote}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="w-full p-5">
                  {plan === 'Pro' && <UpgradeButton />}

                  {plan === 'Free' && (
                    <Link
                      href={session?.user ? '/dashboard' : '/sign-in'}
                      className={buttonVariants({
                        className: 'w-full',
                        variant: 'secondary'
                      })}
                    >
                      {session?.user ? 'Upgrade now' : 'Sign Up'} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
