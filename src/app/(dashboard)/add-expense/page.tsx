'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateExpense } from '@/hooks/useExpenses';
import { CreateExpenseDto } from '@/types';

function AddExpensePageContent() {
  const router = useRouter();
  const createMutation = useCreateExpense();

  const handleSubmit = (data: CreateExpenseDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/expenses');
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Add Expense
      </h1>
      <Card padding="lg">
        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/expenses')}
          isLoading={createMutation.isPending}
        />
      </Card>
    </div>
  );
}

export default function AddExpensePage() {
  return (
    <ProtectedRoute>
      <AddExpensePageContent />
    </ProtectedRoute>
  );
}

