'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLogout, useMe } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

export const Header = () => {
  const pathname = usePathname();
  const { data: user } = useMe();
  const logoutMutation = useLogout();

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isDashboardPage =
    pathname?.startsWith('/expenses') ||
    pathname?.startsWith('/add-expense') ||
    pathname?.startsWith('/chart') ||
    pathname?.startsWith('/budget');

  if (isAuthPage) {
    return (
      <header className="border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400 tracking-tight">
            Expense Tracker
          </Link>
          <ThemeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400 tracking-tight">
            Expense Tracker
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            {isDashboardPage && (
              <>
                <Link
                  href="/expenses"
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/expenses'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  Expenses
                </Link>
                <Link
                  href="/add-expense"
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/add-expense'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  Add Expense
                </Link>
                <Link
                  href="/chart"
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/chart'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  Charts
                </Link>
                <Link
                  href="/budget"
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/budget'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  Budget
                </Link>
              </>
            )}
            {user && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.name}
              </span>
            )}
            <ThemeToggle />
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                isLoading={logoutMutation.isPending}
              >
                Logout
              </Button>
            )}
            {!user && (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

