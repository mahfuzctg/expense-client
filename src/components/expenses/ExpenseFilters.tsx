'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { EXPENSE_CATEGORIES } from '@/utils/constants';

interface ExpenseFiltersProps {
	category?: string;
	month?: string;
	year?: string;
	onChange: (filters: { category?: string; month?: string; year?: string }) => void;
	isLoading?: boolean;
}

export function ExpenseFilters({
	category,
	month,
	year,
	onChange,
	isLoading = false,
}: ExpenseFiltersProps) {
	const months = useMemo(
		() => [
			{ value: '', label: 'All months' },
			{ value: '1', label: 'January' },
			{ value: '2', label: 'February' },
			{ value: '3', label: 'March' },
			{ value: '4', label: 'April' },
			{ value: '5', label: 'May' },
			{ value: '6', label: 'June' },
			{ value: '7', label: 'July' },
			{ value: '8', label: 'August' },
			{ value: '9', label: 'September' },
			{ value: '10', label: 'October' },
			{ value: '11', label: 'November' },
			{ value: '12', label: 'December' },
		],
		[]
	);

	const years = useMemo(() => {
		const currentYear = new Date().getFullYear();
		const list = [{ value: '', label: 'All years' }];
		for (let y = currentYear; y >= currentYear - 10; y--) {
			list.push({ value: String(y), label: String(y) });
		}
		return list;
	}, []);

	return (
		<div className="flex flex-wrap gap-3 items-end">
			<div className="min-w-[180px]">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Category
				</label>
				<select
					value={category ?? ''}
					onChange={(e) =>
						onChange({ category: e.target.value || undefined, month, year })
					}
					disabled={isLoading}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
				>
					<option value="">All categories</option>
					{EXPENSE_CATEGORIES.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>
			<div className="min-w-[160px]">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Month
				</label>
				<select
					value={month ?? ''}
					onChange={(e) => onChange({ category, month: e.target.value || undefined, year })}
					disabled={isLoading}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
				>
					{months.map((m) => (
						<option key={m.value} value={m.value}>
							{m.label}
						</option>
					))}
				</select>
			</div>
			<div className="min-w-[140px]">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Year
				</label>
				<select
					value={year ?? ''}
					onChange={(e) => onChange({ category, month, year: e.target.value || undefined })}
					disabled={isLoading}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
				>
					{years.map((y) => (
						<option key={y.value} value={y.value}>
							{y.label}
						</option>
					))}
				</select>
			</div>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => onChange({})}
				disabled={isLoading}
				className="mt-6"
			>
				Reset
			</Button>
		</div>
	);
}


