import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/utils/constants';
import { ApiResponse, BudgetSummary } from '@/types';

export const budgetService = {
  getSummary: async (params?: {
    month?: number;
    year?: number;
  }): Promise<BudgetSummary> => {
    const response = await axiosInstance.get<ApiResponse<BudgetSummary>>(
      API_ENDPOINTS.BUDGETS.SUMMARY,
      {
        params,
      }
    );
    return response.data.data;
  },

  upsert: async (payload: {
    amount: number;
    month?: number;
    year?: number;
  }): Promise<BudgetSummary> => {
    const response = await axiosInstance.put<ApiResponse<BudgetSummary>>(
      API_ENDPOINTS.BUDGETS.UPSERT,
      payload
    );
    return response.data.data;
  },
};


