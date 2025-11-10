import { axiosInstance } from '@/lib/axios';
import {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseStats,
  ApiResponse,
} from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

export const expenseService = {
  getAll: async (filters?: {
    category?: string;
    month?: number;
    year?: number;
  }): Promise<Expense[]> => {
    const response = await axiosInstance.get<ApiResponse<Expense[]>>(
      API_ENDPOINTS.EXPENSES.LIST,
      {
        params: filters,
      }
    );
    return response.data.data ?? [];
  },

  getById: async (id: string): Promise<Expense> => {
    const response = await axiosInstance.get<ApiResponse<Expense>>(
      API_ENDPOINTS.EXPENSES.UPDATE(id)
    );
    if (!response.data.data) {
      throw new Error('Expense not found');
    }
    return response.data.data;
  },

  create: async (data: CreateExpenseDto): Promise<Expense> => {
    const response = await axiosInstance.post<ApiResponse<Expense>>(
      API_ENDPOINTS.EXPENSES.CREATE,
      data
    );
    if (!response.data.data) {
      throw new Error('Failed to create expense');
    }
    return response.data.data;
  },

  update: async (id: string, data: UpdateExpenseDto): Promise<Expense> => {
    const response = await axiosInstance.patch<ApiResponse<Expense>>(
      API_ENDPOINTS.EXPENSES.UPDATE(id),
      data
    );
    if (!response.data.data) {
      throw new Error('Failed to update expense');
    }
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.EXPENSES.DELETE(id));
  },

  getStats: async (): Promise<ExpenseStats> => {
    const response = await axiosInstance.get<ApiResponse<ExpenseStats>>(
      API_ENDPOINTS.EXPENSES.STATS
    );
    return response.data.data ?? [];
  },
};

