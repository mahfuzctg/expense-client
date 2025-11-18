import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '@/services/budget.service';
import { BudgetSummary, UpsertBudgetDto } from '@/types';

const buildKey = (month?: number, year?: number) => ['budget', month ?? 'current', year ?? 'current'];

export const useBudgetSummary = (params?: { month?: number; year?: number }) => {
  const month = params?.month;
  const year = params?.year;

  return useQuery<BudgetSummary>({
    queryKey: buildKey(month, year),
    queryFn: () => budgetService.getSummary({ month, year }),
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertBudgetDto) => budgetService.upsert(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: buildKey(variables.month, variables.year) });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });
};


