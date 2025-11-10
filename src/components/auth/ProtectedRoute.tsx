'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useMe } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    isError,
    error,
    isFetching,
  } = useMe();

  useEffect(() => {
    if (isLoading || isFetching) {
      return;
    }

    if (user) {
      return;
    }

    const status = (error as AxiosError | undefined)?.response?.status;
    if (status === 401 || isError || !user) {
      router.push('/login');
    }
  }, [user, isLoading, isFetching, isError, error, router]);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return <>{children}</>;
};

