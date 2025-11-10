'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/validation';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="Enter your email"
        disabled={loginMutation.isPending}
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Enter your password"
        disabled={loginMutation.isPending}
      />
      {loginMutation.isError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : 'Invalid email or password'}
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={loginMutation.isPending}
      >
        Login
      </Button>
    </form>
  );
};

