import { LogOut, Moon, Sun, UsersRound } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Button } from "./ui/Button";

export const AppLayout = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="flex min-w-0 items-center gap-3" to="/">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-emerald-600 text-white">
              <UsersRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold">Smart Leads</span>
              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.name} · {user?.role}
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Toggle dark mode"
              className="w-10 px-0"
              icon={theme === "dark" ? Sun : Moon}
              title="Toggle dark mode"
              type="button"
              variant="secondary"
              onClick={toggleTheme}
            />
            <Button icon={LogOut} type="button" variant="secondary" onClick={() => void logout()}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
