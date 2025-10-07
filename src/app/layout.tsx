import type { Metadata } from 'next';
import { Inter, Pacifico } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const fontHeadline = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
});

const fontBrand = Pacifico({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-brand',
});

export const metadata: Metadata = {
  title: 'Noether - Simply and Lovely Learning',
  description: 'Your personal AI study assistant to master any subject.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased',
          fontBody.variable,
          fontHeadline.variable,
          fontBrand.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
