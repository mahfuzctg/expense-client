'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBudgetSummary, useUpdateBudget } from '@/hooks/useBudget';
import { formatCurrency } from '@/utils/validation';
import { cn } from '@/utils/cn';
import { BudgetStatus } from '@/types';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, index) => currentYear - 3 + index);
};

const STATUS_CONFIG: Record<
  BudgetStatus,
  { label: string; badge: string; bar: string }
> = {
  safe: {
    label: 'On track',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    bar: 'from-green-400 to-green-600',
  },
  warning: {
    label: 'Approaching limit',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    bar: 'from-yellow-400 to-yellow-600',
  },
  danger: {
    label: 'Over budget',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    bar: 'from-red-400 to-red-600',
  },
  not_set: {
    label: 'No budget set',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-200',
    bar: 'from-gray-300 to-gray-400',
  },
};

interface BudgetTrackerProps {
  compact?: boolean;
}

export const BudgetTracker = ({ compact = false }: BudgetTrackerProps) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { data, isLoading, isFetching, isError, error } = useBudgetSummary({ month, year });
  const updateBudget = useUpdateBudget();

  const [amountInput, setAmountInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (data?.budget?.amount !== undefined) {
      setAmountInput(data.budget.amount.toString());
    } else {
      setAmountInput('');
    }
  }, [data?.budget?.amount, month, year]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (amountInput === '') {
      setFormError('Amount is required');
      return;
    }

    const numericAmount = Number(amountInput);
    if (Number.isNaN(numericAmount) || numericAmount < 0) {
      setFormError('Please enter a valid amount greater than or equal to 0');
      return;
    }

    updateBudget.mutate(
      {
        amount: numericAmount,
        month,
        year,
      },
      {
        onError: (mutationError) => {
          setFormError(mutationError instanceof Error ? mutationError.message : 'Failed to update budget');
        },
      }
    );
  };

  const summary = data;
  const status = summary?.status ?? 'not_set';
  const config = STATUS_CONFIG[status];
  const usagePercent = summary?.hasBudget ? summary.percentage : 0;
  const progressWidth = summary?.hasBudget ? Math.min(summary.percentage, 150) : 0;
  const totalSpent = summary ? summary.totalExpenses : 0;
  const budgetAmount = summary?.budget?.amount ?? 0;
  const remainingAmount = summary?.hasBudget ? summary.remaining : 0;
  const isBusy = isLoading || isFetching;

  return (
    <Card padding={compact ? 'md' : 'lg'}>
      <div className="flex flex-col gap-4">
        <div className={cn('flex flex-col gap-2', compact ? 'sm:flex-row sm:items-center sm:justify-between' : '')}>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Monthly Budget</p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {MONTHS[month - 1]} {year}
            </h2>
          </div>
          <div className="flex gap-2">
            <select
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
            >
              {MONTHS.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            >
              {getYearOptions().map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {error instanceof Error ? error.message : 'Failed to load budget summary'}
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {summary?.hasBudget ? 'Budget usage' : 'Set a budget to start tracking'}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                config.badge
              )}
            >
              {config.label}
            </span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className={cn(
                'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all duration-500',
                config.bar
              )}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          {summary?.hasBudget && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {usagePercent.toFixed(1)}% of your budget used
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Spent</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Budget</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {summary?.hasBudget ? formatCurrency(budgetAmount) : 'Not set'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {status === 'danger' ? 'Overspent' : 'Remaining'}
            </p>
            <p
              className={cn(
                'text-xl font-semibold',
                status === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
              )}
            >
              {summary?.hasBudget
                ? status === 'danger'
                  ? formatCurrency(Math.abs(remainingAmount))
                  : formatCurrency(Math.max(remainingAmount, 0))
                : '—'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xs">
            <Input
              type="number"
              step="0.01"
              min="0"
              label="Set monthly budget"
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              error={formError ?? undefined}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="sm:w-auto"
            isLoading={updateBudget.isPending}
            disabled={isBusy}
          >
            {summary?.hasBudget ? 'Update Budget' : 'Save Budget'}
          </Button>
        </form>

        {isBusy && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Syncing latest expenses and budget details...
          </p>
        )}
      </div>
    </Card>
  );
};


