import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="flex flex-col items-center justify-center mb-12 mt-28 sm:mt-40 text-center">
        <h1 className="font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl max-w-4xl">
          Chat with your <span className="text-green-500">documents</span> in seconds
        </h1>
        <p className="mt-5 max-w-prose text-muted-foreground sm:text-lg">
          Emna allows you to have conversations with any PDF document. Simply upload your
          file and start asking questions right away.
        </p>

        <Link
          href="/dashboard"
          className={buttonVariants({ size: 'lg', className: 'mt-5' })}
          target="_blank"
        >
          Get started &rarr;
        </Link>
      </MaxWidthWrapper>

      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 60.2% 10.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
            className="relative aspect-[1155/678] rotate-[20deg] bg-gradient-to-tr from-[#88e0c4] to-[#46db5f] opacity-60 w-[100.1875rem] -translate-x-2/3 sm:translate-x-0 -translate-y-1/4 sm:translate-y-0"
          />
        </div>

        <div className="mx-auto mt-16 max-w-6xl sm:px-8 px-2 sm:mt-24">
          <div className="-m-2 ring-1 ring-inset ring-gray-900/10 rounded-2xl p-2 lg:p-4 mx-auto">
            <Image
              src="/dashboard-preview.jpg"
              alt="dashboard preview"
              width={1364}
              height={866}
              quality={100}
              className="ring-1 bg-white p-2 md:p-4 rounded-md ring-gray-900/10 shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="sm:text-center space-y-4 p-6">
          <h2 className="text-gray-900 font-bold text-4xl sm:text-5xl">
            Start chatting in minutes
          </h2>
          <p className="text-muted-foreground text-lg">
            Chatting to your PDF Files has never been easier than with Emna.
          </p>
        </div>

        <ol className="my-8 md:flex space-y-4 md:space-x-12 md:space-y-0 pt-8 md:mx-2">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 md:border-l-0 md:border-t-2 border-zinc-300 py-2 pl-4 md:pl-0 md:pt-4">
              <span className="text-green-600 text-sm font-medium">Step 1</span>
              <span className="text-gray-900 font-medium text-xl">
                Sign up for an account
              </span>
              <span className="text-muted-foreground text-sm">
                Either continue with free plan or choose our{' '}
                <Link
                  href="/pricing"
                  className="text-green-600 hover:text-green-500 underline underline-offset-2"
                >
                  pro plan
                </Link>
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 md:border-l-0 md:border-t-2 border-zinc-300 py-2 pl-4 md:pl-0 md:pt-4">
              <span className="text-green-600 text-sm font-medium">Step 2</span>
              <span className="text-gray-900 font-medium text-xl">
                Upload your PDF file
              </span>
              <span className="text-muted-foreground text-sm">
                We&apos;ll process your file and make it ready for you to chat with.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 md:border-l-0 md:border-t-2 border-zinc-300 py-2 pl-4 md:pl-0 md:pt-4">
              <span className="text-green-600 text-sm font-medium">Step 3</span>
              <span className="text-gray-900 font-medium text-xl">
                Start asking questions
              </span>
              <span className="text-muted-foreground text-sm">
                It&apos;s that simple. Try out Emna today!
              </span>
            </div>
          </li>
        </ol>

        <div className="mx-auto mt-16 max-w-6xl sm:px-8 px-2 sm:mt-24">
          <div className="-m-2 ring-1 ring-inset ring-gray-900/10 rounded-2xl p-2 lg:p-4 mx-auto">
            <Image
              src="/file-upload-preview.jpg"
              alt="upload preview"
              width={1419}
              height={732}
              quality={100}
              className="ring-1 bg-white p-2 md:p-4 rounded-md ring-gray-900/10 shadow-2xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}
