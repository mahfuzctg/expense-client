import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '@/services/expense.service';
import { CreateExpenseDto, UpdateExpenseDto } from '@/types';

export const useExpenses = (filters?: {
  category?: string;
  month?: string;
  year?: string;
}) => {
  const normalizedFilters = {
    category: filters?.category || undefined,
    month: filters?.month ? Number(filters.month) : undefined,
    year: filters?.year ? Number(filters.year) : undefined,
  };

  return useQuery({
    queryKey: [
      'expenses',
      normalizedFilters.category ?? 'all',
      normalizedFilters.month ?? 'all',
      normalizedFilters.year ?? 'all',
    ],
    queryFn: () => expenseService.getAll(normalizedFilters),
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: () => expenseService.getById(id),
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseStats'] });
      queryClient.invalidateQueries({ queryKey: ['budgetSummary'] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDto }) =>
      expenseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseStats'] });
      queryClient.invalidateQueries({ queryKey: ['budgetSummary'] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseStats'] });
      queryClient.invalidateQueries({ queryKey: ['budgetSummary'] });
    },
  });
};

export const useExpenseStats = () => {
  return useQuery({
    queryKey: ['expenseStats'],
    queryFn: () => expenseService.getStats(),
  });
};

