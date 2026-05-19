import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  hideLabel?: boolean;
}

const controlClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-950";

const Field = ({ children, error, hideLabel = false, label }: FieldProps) => (
  <label className="grid gap-1.5">
    <span className={hideLabel ? "sr-only" : "text-sm font-medium text-slate-700 dark:text-slate-200"}>{label}</span>
    {children}
    {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
  </label>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hideLabel?: boolean;
}

export const Input = ({ className = "", error, hideLabel, label, ...props }: InputProps) => (
  <Field label={label} error={error} hideLabel={hideLabel}>
    <input className={`${controlClass} ${className}`} {...props} />
  </Field>
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hideLabel?: boolean;
}

export const Select = ({ children, className = "", error, hideLabel, label, ...props }: SelectProps) => (
  <Field label={label} error={error} hideLabel={hideLabel}>
    <select className={`${controlClass} ${className}`} {...props}>
      {children}
    </select>
  </Field>
);
