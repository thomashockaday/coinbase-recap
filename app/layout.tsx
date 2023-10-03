import { ThemeProvider } from '@/components/provider/theme-provider';
import { Footer } from '@/components/template/footer';
import { Header } from '@/components/template/header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coinbase Recap',
  description:
    'View a breakdown of your Coinbase transaction history by uploading a CSV',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
