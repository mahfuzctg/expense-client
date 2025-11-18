'use client';

import { BudgetTracker } from '@/components/budget/BudgetTracker';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function BudgetPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-primary-600 dark:text-primary-300">Budget Tracker</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stay ahead of your spending</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Set a monthly budget, track progress in real time, and get alerted before you overspend.
        </p>
      </div>
      <BudgetTracker />
    </div>
  );
}

export default function BudgetPage() {
  return (
    <ProtectedRoute>
      <BudgetPageContent />
    </ProtectedRoute>
  );
}


