'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Expense, ExpenseStats } from '@/types';
import { formatCurrency } from '@/utils/validation';

interface ExpenseChartProps {
  expenses: Expense[];
  categorySummary: ExpenseStats;
  type?: 'line' | 'bar' | 'pie';
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
];

export const ExpenseChart = ({
  expenses,
  categorySummary,
  type = 'bar',
}: ExpenseChartProps) => {
  const monthlyData = useMemo(() => {
    const map = new Map<string, { month: string; total: number }>();

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(
        2,
        '0'
      )}`;
      const monthLabel = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      if (!map.has(key)) {
        map.set(key, { month: monthLabel, total: 0 });
      }

      map.get(key)!.total += expense.amount;
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
  }, [expenses]);

  const categoryData = useMemo(
    () =>
      (categorySummary || []).map((item) => ({
        name: item.category,
        value: item.total,
      })),
    [categorySummary]
  );

  if (type === 'pie' && categoryData.length > 0) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar' && categoryData.length > 0) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

