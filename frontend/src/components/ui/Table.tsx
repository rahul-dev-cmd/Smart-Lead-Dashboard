import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import type { Pagination } from "../../types";

interface Column<TItem> {
  header: string;
  render: (item: TItem) => ReactNode;
  className?: string;
}

interface TableProps<TItem> {
  items: TItem[];
  columns: Column<TItem>[];
  getKey: (item: TItem) => string;
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export const Table = <TItem,>({ columns, getKey, items, onPageChange, pagination }: TableProps<TItem>) => (
  <div className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-900/70">
          <tr>
            {columns.map((column) => (
              <th
                className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500 dark:text-slate-400 ${column.className ?? ""}`}
                key={column.header}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item) => (
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/70" key={getKey(item)}>
              {columns.map((column) => (
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200" key={column.header}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalRecords} records
      </span>
      <div className="flex items-center gap-2">
        <Button
          icon={ChevronLeft}
          type="button"
          variant="secondary"
          disabled={pagination.currentPage <= 1}
          onClick={() => onPageChange(pagination.currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          icon={ChevronRight}
          type="button"
          variant="secondary"
          disabled={pagination.currentPage >= pagination.totalPages}
          onClick={() => onPageChange(pagination.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  </div>
);
