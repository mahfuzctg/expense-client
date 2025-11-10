import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200 px-3 py-1 text-xs font-medium mb-4">
          Smart spending. Clear insights.
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Take control of your&nbsp;
          <span className="text-primary-600 dark:text-primary-400">expenses</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A modern dashboard to track spending, visualize trends, and make smarter financial decisions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="card-gradient">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Get Started
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create an account to start tracking your expenses and manage your
            finances effectively.
          </p>
          <Link href="/register">
            <Button variant="primary" className="w-full">
              Register Now
            </Button>
          </Link>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Already have an account?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign in to access your expense data and continue tracking your
            spending.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Login
            </Button>
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>✓ Track expenses by category</li>
          <li>✓ View detailed statistics and charts</li>
          <li>✓ Manage your spending efficiently</li>
          <li>✓ Dark mode support</li>
        </ul>
      </Card>
    </div>
  );
}

