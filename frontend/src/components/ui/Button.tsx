import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const variantClass: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200",
  secondary:
    "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200",
  ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-200 dark:text-slate-200 dark:hover:bg-slate-800"
};

export const Button = ({ children, className = "", icon: Icon, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]} ${className}`}
    {...props}
  >
    {Icon ? <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
    {children}
  </button>
);
