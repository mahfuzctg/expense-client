'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRegister } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/validation';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

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
    registerMutation.mutate({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        placeholder="Enter your name"
        disabled={registerMutation.isPending}
      />
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="Enter your email"
        disabled={registerMutation.isPending}
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Enter your password"
        disabled={registerMutation.isPending}
      />
      {registerMutation.isError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
          {registerMutation.error instanceof Error
            ? registerMutation.error.message
            : 'Registration failed. Please try again.'}
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={registerMutation.isPending}
      >
        Register
      </Button>
    </form>
  );
};

