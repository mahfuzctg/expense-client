import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '@/services/budget.service';

export const useBudgetSummary = (params?: {
  month?: number;
  year?: number;
}) => {
  const normalized = {
    month: params?.month,
    year: params?.year,
  };

  return useQuery({
    queryKey: ['budgetSummary', normalized.month ?? 'current', normalized.year ?? 'current'],
    queryFn: () => budgetService.getSummary(normalized),
  });
};

export const useUpsertBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: budgetService.upsert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetSummary'] });
    },
  });
};


