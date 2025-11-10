import { CardProps } from '@/types';
import { cn } from '@/utils/cn';

export const Card = ({
  children,
  className,
  padding = 'md',
}: CardProps) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200/70 dark:border-gray-700/70',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

