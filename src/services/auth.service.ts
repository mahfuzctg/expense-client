import { axiosInstance } from '@/lib/axios';
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    const payload = response.data.data;

    if (!payload) {
      throw new Error('Invalid login response');
    }

    if (typeof window !== 'undefined' && payload.token) {
      localStorage.setItem('token', payload.token);
    }

    return payload;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );
    const payload = response.data.data;

    if (!payload) {
      throw new Error('Invalid register response');
    }

    if (typeof window !== 'undefined' && payload.token) {
      localStorage.setItem('token', payload.token);
    }

    return payload;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.ME
    );
    const payload = response.data.data;

    if (!payload) {
      throw new Error('Invalid user response');
    }

    return payload;
  },
};

