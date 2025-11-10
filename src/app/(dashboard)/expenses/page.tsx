'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useExpenses, useDeleteExpense, useUpdateExpense } from '@/hooks/useExpenses';
import { useCreateExpense } from '@/hooks/useExpenses';
import { CreateExpenseDto, Expense, UpdateExpenseDto } from '@/types';
import { formatCurrency, formatDate } from '@/utils/validation';
import Link from 'next/link';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';
import { BudgetTracker } from '@/components/budget/BudgetTracker';

function ExpensesPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [month, setMonth] = useState<string | undefined>(undefined);
  const [year, setYear] = useState<string | undefined>(undefined);
  const {
    data: expenses,
    isLoading,
    isError,
    error,
  } = useExpenses({ category, month, year });
  const deleteMutation = useDeleteExpense();
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();

  const handleCreate = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: CreateExpenseDto) => {
    if (editingExpense) {
      const payload: UpdateExpenseDto = { ...data };
      updateMutation.mutate(
        { id: editingExpense.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingExpense(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleFiltersChange = (filters: {
    category?: string;
    month?: string;
    year?: string;
  }) => {
    setCategory(filters.category);
    setMonth(filters.month);
    setYear(filters.year);
  };

  const handleBudgetPeriodChange = (period: { month: number; year: number }) => {
    setMonth(String(period.month));
    setYear(String(period.year));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Expenses
        </h1>
        <div className="flex gap-2">
          <Link href="/add-expense">
            <Button variant="primary">Add Expense</Button>
          </Link>
          <Button variant="outline" onClick={handleCreate}>
            Quick Add
          </Button>
        </div>
      </div>

      <BudgetTracker
        month={month ? Number(month) : undefined}
        year={year ? Number(year) : undefined}
        onPeriodChange={handleBudgetPeriodChange}
      />

      <Card className="mb-4" padding="lg">
        <ExpenseFilters
          category={category}
          month={month}
          year={year}
          onChange={handleFiltersChange}
          isLoading={isLoading}
        />
      </Card>

      {isError && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
          {error instanceof Error ? error.message : 'Failed to load expenses.'}
        </div>
      )}

      <Card>
        {expenses && expenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead align="right">Amount</TableHead>
                <TableHead align="right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {expense.title}
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      Added {formatDate(expense.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell align="right" className="font-medium">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        isLoading={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No expenses found. Start by adding your first expense!
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          expense={editingExpense || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}

export default function ExpensesPage() {
  return (
    <ProtectedRoute>
      <ExpensesPageContent />
    </ProtectedRoute>
  );
}

