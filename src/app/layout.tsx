import type { Metadata } from 'next';
import './globals.css';
import { cn, constructMetadata } from '@/lib/utils';
import Providers from '@/components/Providers';
import { Toaster } from 'sonner';

import 'simplebar-react/dist/simplebar.min.css';
import Navbar from '@/components/nav/Navbar';

export const metadata = constructMetadata();

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={cn('min-h-screen font-sans antialiased grainy')}>
        <main>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </main>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
