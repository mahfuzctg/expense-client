export const Footer = () => {
  return (
    <footer className="border-t border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 mt-auto backdrop-blur">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Expense Tracker. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-right">
          Built with Next.js, Tailwind CSS &amp; React Query
        </p>
      </div>
    </footer>
  );
};

