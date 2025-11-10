'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBudgetSummary, useUpsertBudget } from '@/hooks/useBudget';
import { formatCurrency } from '@/utils/validation';
import { cn } from '@/utils/cn';

type BudgetStatus = 'empty' | 'ok' | 'warning' | 'danger';

const monthOptions = [
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

type BudgetTrackerProps = {
  month?: number;
  year?: number;
  onPeriodChange?: (period: { month: number; year: number }) => void;
};

export const BudgetTracker = ({
  month,
  year,
  onPeriodChange,
}: BudgetTrackerProps) => {
  const now = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState(month ?? now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(year ?? now.getFullYear());
  const [amountInput, setAmountInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof month === 'number' && month !== selectedMonth) {
      setSelectedMonth(month);
      return;
    }
    if (month === undefined) {
      const fallbackMonth = now.getMonth() + 1;
      if (selectedMonth !== fallbackMonth) {
        setSelectedMonth(fallbackMonth);
      }
    }
  }, [month, now, selectedMonth]);

  useEffect(() => {
    if (typeof year === 'number' && year !== selectedYear) {
      setSelectedYear(year);
      return;
    }
    if (year === undefined) {
      const fallbackYear = now.getFullYear();
      if (selectedYear !== fallbackYear) {
        setSelectedYear(fallbackYear);
      }
    }
  }, [year, now, selectedYear]);

  const yearsList = useMemo(() => {
    const current = now.getFullYear();
    return Array.from({ length: 7 }, (_, idx) => current + 1 - idx);
  }, [now]);

  const { data: summary, isLoading, isFetching } = useBudgetSummary({
    month: selectedMonth,
    year: selectedYear,
  });
  const upsertBudget = useUpsertBudget();

  useEffect(() => {
    if (!summary) {
      return;
    }
    setAmountInput(summary.amount >= 0 ? String(summary.amount) : '');
  }, [summary]);

  const statusCopy: Record<BudgetStatus, { label: string; badge: string }> = {
    empty: {
      label: 'No budget set',
      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300',
    },
    ok: {
      label: 'On track',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
    },
    warning: {
      label: 'Caution',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
    },
    danger: {
      label: 'Over budget',
      badge: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200',
    },
  };

  const progressColor =
    summary?.status === 'danger'
      ? '#dc2626'
      : summary?.status === 'warning'
      ? '#d97706'
      : '#10b981';
  const progressAngle = Math.min(summary?.percentage ?? 0, 100) * 3.6;

  const handlePeriodChange = (nextMonth: number, nextYear: number) => {
    setSelectedMonth(nextMonth);
    setSelectedYear(nextYear);
    onPeriodChange?.({ month: nextMonth, year: nextYear });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = Number(amountInput);
    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setFormError('Enter a valid non-negative amount.');
      return;
    }
    setFormError(null);
    upsertBudget.mutate({
      amount: parsedAmount,
      month: selectedMonth,
      year: selectedYear,
    });
  };

  return (
    <Card className="mb-6 overflow-hidden" padding="lg">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Monthly Budget Overview
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {monthOptions[selectedMonth - 1]} {selectedYear}
            </h2>
            {summary && (
              <span
                className={cn(
                  'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full mt-2',
                  statusCopy[summary.status].badge
                )}
              >
                {statusCopy[summary.status].label}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => handlePeriodChange(Number(e.target.value), selectedYear)}
              className="min-w-[150px] px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthOptions.map((label, idx) => (
                <option key={label} value={idx + 1}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => handlePeriodChange(selectedMonth, Number(e.target.value))}
              className="min-w-[120px] px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {yearsList.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summary ? formatCurrency(summary.amount) : '--'}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summary ? formatCurrency(summary.spent) : '--'}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summary ? formatCurrency(summary.remaining) : '--'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                label="Set monthly budget"
                placeholder="Enter amount"
                error={formError ?? undefined}
              />
              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto"
                  isLoading={upsertBudget.isPending}
                  disabled={isLoading || isFetching}
                >
                  {summary?.budgetId ? 'Update budget' : 'Save budget'}
                </Button>
              </div>
            </form>
            {upsertBudget.isSuccess && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Budget saved successfully.
              </p>
            )}
            {upsertBudget.isError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {(upsertBudget.error instanceof Error && upsertBudget.error.message) ||
                  'Failed to save budget. Please try again.'}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              <div
                className="absolute inset-0 rounded-full transition-all duration-300"
                style={{
                  background: `conic-gradient(${progressColor} ${progressAngle}deg, rgba(148,163,184,0.2) ${progressAngle}deg)`,
                }}
              />
              <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Used
                </span>
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summary ? `${Math.min(Math.round(summary.percentage), 999)}%` : '--'}
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {summary
                ? summary.status === 'danger'
                  ? 'You have exceeded the budget.'
                  : summary.status === 'warning'
                  ? 'Approaching the budget limit.'
                  : summary.status === 'empty'
                  ? 'Set a budget to start tracking.'
                  : 'Great job staying within budget!'
                : 'Loading budget data...'}
            </p>
            {summary?.status === 'danger' && (
              <div className="mt-3 w-full rounded-xl border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                Spending has exceeded the budget. Review recent expenses to regain
                control.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};


