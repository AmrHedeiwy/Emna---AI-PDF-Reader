import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MaxWidthWrapper className="flex flex-col items-center justify-center mt-28 sm:mt-40">
      {children}
    </MaxWidthWrapper>
  );
}
