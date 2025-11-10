import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const Table = ({ children, className }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          'min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm',
          className
        )}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className }: TableHeaderProps) => {
  return (
    <thead
      className={cn(
        'bg-gray-50/80 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60',
        className
      )}
    >
      {children}
    </thead>
  );
};

export const TableRow = ({
  children,
  className,
  onClick,
}: TableRowProps) => {
  return (
    <tr
      className={cn(
        'hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({
  children,
  className,
  align = 'left',
}: TableCellProps) => {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400',
        alignStyles[align],
        className
      )}
    >
      {children}
    </th>
  );
};

export const TableCell = ({
  children,
  className,
  align = 'left',
}: TableCellProps) => {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={cn(
        'px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap',
        alignStyles[align],
        className
      )}
    >
      {children}
    </td>
  );
};

