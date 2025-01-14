import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function DataTable({
	columns,
	data,
	actions,
	pageSize = 5,
	isLoading = false
}) {
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(data.length / pageSize);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const currentData = data.slice(startIndex, endIndex);

	const LoadingSkeleton = () => (
		<tr>
			<td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4">
				<div className="animate-pulse space-y-3">
					{[...Array(pageSize)].map((_, idx) => (
						<div key={idx} className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
					))}
				</div>
			</td>
		</tr>
	);

	return (
		<div className="overflow-hidden glass-card">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead>
						<tr className="bg-gray-200 dark:bg-gray-700">
							{columns.map((column) => (
								<th
									key={column.accessorKey}
									className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider"
								>
									{column.header}
								</th>
							))}
							{actions && (
								<th className="px-6 py-4 text-right text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
									Ações
								</th>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{isLoading ? (
							<LoadingSkeleton />
						) : currentData.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length + (actions ? 1 : 0)}
									className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300"
								>
									Nenhum registro encontrado
								</td>
							</tr>
						) : (
							currentData.map((row, rowIndex) => (
								<tr
									key={row.id || rowIndex}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
								>
									{columns.map((column) => (
										<td
											key={column.accessorKey}
											className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"
										>
											{column.cell ? column.cell(row) : getNestedValue(row, column.accessorKey)}
										</td>
									))}
									{actions && (
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<div className="flex justify-end gap-2">
												{actions(row)}
											</div>
										</td>
									)}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="border-t border-gray-200 dark:border-gray-700">
					<div className="px-4 py-3 flex items-center justify-between">
						<div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
							<p>
								Mostrando <span className="font-medium">{startIndex + 1}</span> até{' '}
								<span className="font-medium">{Math.min(endIndex, data.length)}</span>{' '}
								de <span className="font-medium">{data.length}</span> resultados
							</p>
						</div>
						<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
							<button
								onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
								disabled={currentPage === 1}
								className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
							>
								<ChevronLeftIcon className="h-5 w-5" />
							</button>
							{[...Array(totalPages)].map((_, index) => (
								<button
									key={index + 1}
									onClick={() => setCurrentPage(index + 1)}
									className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium
                    ${currentPage === index + 1
											? 'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-300'
											: 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
										}`}
								>
									{index + 1}
								</button>
							))}
							<button
								onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
								disabled={currentPage === totalPages}
								className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
							>
								<ChevronRightIcon className="h-5 w-5" />
							</button>
						</nav>
					</div>
				</div>
			)}
		</div>
	);
}

// Adicione esta função auxiliar para acessar propriedades aninhadas
function getNestedValue(obj, path) {
	return path.split('.').reduce((value, key) => value && value[key], obj);
}