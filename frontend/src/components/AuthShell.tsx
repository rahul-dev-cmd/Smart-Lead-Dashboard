import { UsersRound } from "lucide-react";
import type { ReactNode } from "react";

export const AuthShell = ({ children, subtitle, title }: { title: string; subtitle: string; children: ReactNode }) => (
  <div className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
    <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-600 text-white">
          <UsersRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  </div>
);
