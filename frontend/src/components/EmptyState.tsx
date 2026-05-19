import { Inbox } from "lucide-react";

export const EmptyState = ({ message, title }: { title: string; message: string }) => (
  <div className="grid place-items-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
    <Inbox className="mb-4 h-9 w-9 text-slate-400" aria-hidden="true" />
    <h2 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
    <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
  </div>
);
