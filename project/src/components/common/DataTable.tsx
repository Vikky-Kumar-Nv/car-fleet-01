import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  sortableColumns?: (keyof T)[];
  defaultSortKey?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  filtersArea?: React.ReactNode; // custom filters UI supplied by parent
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  onRowClick,
  actions,
  sortableColumns = [],
  defaultSortKey,
  defaultSortDirection = 'asc',
  filtersArea
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize] = useState(10);
  const [sortKey, setSortKey] = useState<keyof T | undefined>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort
  const sortedData = sortKey ? [...filteredData].sort((a,b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av === bv) return 0;
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDirection === 'asc' ? av - bv : bv - av;
    }
    const astr = String(av).toLowerCase();
    const bstr = String(bv).toLowerCase();
    return sortDirection === 'asc' ? astr.localeCompare(bstr) : bstr.localeCompare(astr);
  }) : filteredData;

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Header with search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          {filtersArea && (
            <button
              type="button"
              onClick={() => setShowFilters(s => !s)}
              aria-expanded={showFilters}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <Icon name="filter" className="h-4 w-4 mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          )}
        </div>
        {filtersArea && showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200" role="region" aria-label="Table filters">
            {filtersArea}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => {
                const sortable = sortableColumns.includes(column.key);
                const isActive = sortKey === column.key;
                return (
                  <th
                    key={String(column.key)}
                    onClick={() => sortable && toggleSort(column.key)}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider select-none ${sortable ? 'cursor-pointer' : ''} ${isActive ? 'text-amber-600' : 'text-gray-500'}`}
                  >
                    <span className="inline-flex items-center space-x-1">
                      <span>{column.header}</span>
                      {sortable && isActive && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                      {sortable && !isActive && (
                        <span className="text-gray-300">⇅</span>
                      )}
                    </span>
                  </th>
                );
              })}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render ? column.render(item) : String(item[column.key])}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of{' '}
            {filteredData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              aria-label="Previous page"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              aria-label="Next page"
            >
              <Icon name="chevronRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}