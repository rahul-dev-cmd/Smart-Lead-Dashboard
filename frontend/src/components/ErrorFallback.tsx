import { AlertTriangle } from "lucide-react";

export const ErrorFallback = ({ message }: { message: string }) => (
  <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-950 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100">
    <div className="flex gap-3">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <h2 className="text-sm font-bold">Something needs attention</h2>
        <p className="mt-1 text-sm opacity-85">{message}</p>
      </div>
    </div>
  </div>
);
