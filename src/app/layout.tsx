import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query';
import { ThemeProvider } from '@/lib/theme-provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track and manage your expenses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ReactQueryProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

