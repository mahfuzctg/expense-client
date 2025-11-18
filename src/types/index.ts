import { ExpenseCategory } from '@/utils/constants';

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Expense types
export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface UpdateExpenseDto {
  title?: string;
  amount?: number;
  category?: ExpenseCategory;
  date?: string;
}

export interface ExpenseCategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
}

export type ExpenseStats = ExpenseCategorySummary[];

// Budget types
export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type BudgetStatus = 'safe' | 'warning' | 'danger' | 'not_set';

export interface BudgetSummary {
  budget: Budget | null;
  totalExpenses: number;
  remaining: number;
  percentage: number;
  month: number;
  year: number;
  status: BudgetStatus;
  hasBudget: boolean;
}

export interface UpsertBudgetDto {
  amount: number;
  month?: number;
  year?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Component prop types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

