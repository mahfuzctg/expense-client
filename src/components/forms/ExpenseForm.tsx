'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateExpenseDto, Expense } from '@/types';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '@/utils/constants';
import { validateAmount } from '@/utils/validation';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: CreateExpenseDto) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ExpenseForm = ({
  expense,
  onSubmit,
  onCancel,
  isLoading = false,
}: ExpenseFormProps) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
  }>({});

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setCategory(expense.category as ExpenseCategory);
      setDate(expense.date.split('T')[0]);
    } else {
      setTitle('');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0]);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; amount?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!amount || !validateAmount(parseFloat(amount))) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="e.g. Grocery run"
          disabled={isLoading}
        />
        <Input
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          placeholder="0.00"
          step="0.01"
          min="0"
          disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all"
            disabled={isLoading}
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isLoading}
        >
          {expense ? 'Update Expense' : 'Create Expense'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

