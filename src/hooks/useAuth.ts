import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginCredentials, RegisterCredentials } from '@/types';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/expenses');
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/expenses');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    retry: false,
  });
};

