'use client';

import { Card } from '@/components/ui/Card';
import { ExpenseChart } from '@/components/charts/ExpenseChart';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useExpenses, useExpenseStats } from '@/hooks/useExpenses';
import { formatCurrency } from '@/utils/validation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';

function ChartPageContent() {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const {
    data: expenses,
    isLoading: expensesLoading,
    isError: expensesError,
    error: expensesErr,
  } = useExpenses();
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErr,
  } = useExpenseStats();

  const totalSpent = useMemo(
    () => (stats ?? []).reduce((acc, item) => acc + item.total, 0),
    [stats]
  );
  const categoriesUsed = useMemo(
    () => (stats ?? []).filter((item) => item.count > 0).length,
    [stats]
  );
  const totalTransactions = useMemo(
    () => (stats ?? []).reduce((acc, item) => acc + item.count, 0),
    [stats]
  );

  if (expensesLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Loading charts...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Expense Charts
      </h1>

      {(expensesError || statsError) && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
          {expensesError && (
            <div>
              {expensesErr instanceof Error ? expensesErr.message : 'Failed to load expenses.'}
            </div>
          )}
          {statsError && (
            <div>
              {statsErr instanceof Error ? statsErr.message : 'Failed to load chart data.'}
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalSpent)}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Categories
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {categoriesUsed}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Transactions
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalTransactions}
          </p>
        </Card>
      </div>

      <Card padding="lg" className="mb-6">
        <div className="flex gap-2 mb-4">
          <Button
            variant={chartType === 'line' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            Line Chart
          </Button>
          <Button
            variant={chartType === 'bar' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </Button>
          <Button
            variant={chartType === 'pie' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
          >
            Pie Chart
          </Button>
        </div>
        {expenses && expenses.length > 0 ? (
          <ExpenseChart
            expenses={expenses}
            categorySummary={stats ?? []}
            type={chartType}
          />
        ) : (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No data available. Add some expenses to see charts!
          </div>
        )}
      </Card>

      {stats && stats.length > 0 && (
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Expenses by Category
          </h2>
          <div className="space-y-2">
            {stats.map((item) => (
              <div key={item.category} className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 dark:text-gray-300 block">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default function ChartPage() {
  return (
    <ProtectedRoute>
      <ChartPageContent />
    </ProtectedRoute>
  );
}

