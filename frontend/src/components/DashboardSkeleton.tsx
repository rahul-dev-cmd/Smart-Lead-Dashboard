const shimmer = "relative overflow-hidden bg-slate-200 dark:bg-slate-800 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent dark:before:via-white/10";

export const DashboardSkeleton = () => (
  <div className="grid gap-4">
    <div className="grid gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className={`h-20 rounded-md ${shimmer}`} key={index} />
      ))}
    </div>
    <div className={`h-80 rounded-md ${shimmer}`} />
  </div>
);
