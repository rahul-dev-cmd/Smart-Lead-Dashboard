import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

const iconClass = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

const toneClass = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  error: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100",
  info: "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100"
};

export const ToastViewport = () => {
  const { removeToast, toasts } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 grid w-[calc(100vw-2rem)] max-w-sm gap-3">
      {toasts.map((toast) => {
        const Icon = iconClass[toast.variant];
        return (
          <div className={`rounded-md border p-4 shadow-soft ${toneClass[toast.variant]}`} key={toast.id}>
            <div className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
              </div>
              <button
                aria-label="Dismiss notification"
                className="rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
                type="button"
                onClick={() => removeToast(toast.id)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
