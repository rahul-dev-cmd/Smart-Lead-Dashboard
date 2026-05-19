import type { LeadStatus } from "../types";

const styles: Record<LeadStatus, string> = {
  New: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  Contacted: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  Qualified: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  Lost: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>
);
