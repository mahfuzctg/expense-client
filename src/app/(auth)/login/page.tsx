import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <Card padding="lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Login
        </h1>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Register here
          </Link>
        </p>
      </Card>
    </div>
  );
}

