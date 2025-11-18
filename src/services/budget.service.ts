import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/utils/constants';
import { ApiResponse, BudgetSummary, UpsertBudgetDto } from '@/types';

export const budgetService = {
  getSummary: async (params?: { month?: number; year?: number }): Promise<BudgetSummary> => {
    const response = await axiosInstance.get<ApiResponse<BudgetSummary>>(API_ENDPOINTS.BUDGET.SUMMARY, {
      params,
    });

    if (!response.data.data) {
      throw new Error('Failed to load budget summary');
    }

    return response.data.data;
  },

  upsert: async (payload: UpsertBudgetDto): Promise<BudgetSummary> => {
    const response = await axiosInstance.put<ApiResponse<BudgetSummary>>(API_ENDPOINTS.BUDGET.SUMMARY, payload);

    if (!response.data.data) {
      throw new Error('Failed to update budget');
    }

    return response.data.data;
  },
};


