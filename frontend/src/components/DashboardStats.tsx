import type { Lead } from "../types";

const labels = ["New", "Contacted", "Qualified", "Lost"] as const;

export const DashboardStats = ({ leads, totalRecords }: { leads: Lead[]; totalRecords: number }) => {
  const counts = labels.map((label) => ({
    label,
    value: leads.filter((lead) => lead.status === label).length
  }));

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total matches</p>
        <p className="mt-2 text-3xl font-bold">{totalRecords}</p>
      </div>
      {counts.map((item) => (
        <div className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" key={item.label}>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
          <p className="mt-2 text-3xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
};
