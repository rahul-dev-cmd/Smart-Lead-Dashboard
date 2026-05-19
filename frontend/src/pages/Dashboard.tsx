import { useCallback, useEffect, useState } from "react";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { DashboardStats } from "../components/DashboardStats";
import { EmptyState } from "../components/EmptyState";
import { ErrorFallback } from "../components/ErrorFallback";
import { LeadFilters } from "../components/LeadFilters";
import { LeadForm } from "../components/LeadForm";
import { LeadsTable } from "../components/LeadsTable";
import { useAuth } from "../hooks/useAuth";
import { useLeadsStore } from "../store/useLeadsStore";
import { useToastStore } from "../store/useToastStore";
import { downloadBlob } from "../utils/csvExporter";

export const Dashboard = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const { pushToast } = useToastStore();
  const {
    createLead,
    deleteLead,
    error,
    exportCsv,
    fetchLeads,
    filters,
    isLoading,
    leads,
    pagination,
    setFilters,
    updateStatusOptimistic
  } = useLeadsStore();

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads, filters]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const blob = await exportCsv();
      downloadBlob(blob, "smart-leads.csv");
      pushToast({ title: "CSV exported", variant: "success" });
    } catch (exportError) {
      pushToast({
        title: "CSV export failed",
        description: exportError instanceof Error ? exportError.message : "Please try again.",
        variant: "error"
      });
    } finally {
      setIsExporting(false);
    }
  }, [exportCsv, pushToast]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Leads dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Filter, qualify, export, and manage follow-up ownership from one workspace.
          </p>
        </div>
      </div>

      <DashboardStats leads={leads} totalRecords={pagination.totalRecords} />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="grid gap-4">
          <LeadFilters filters={filters} isExporting={isExporting} onChange={setFilters} onExport={() => void handleExport()} />
          {error ? <ErrorFallback message={error} /> : null}
          {isLoading ? <DashboardSkeleton /> : null}
          {!isLoading && leads.length === 0 ? (
            <EmptyState title="No leads found" message="Adjust the filters or create a lead to start filling the pipeline." />
          ) : null}
          {!isLoading && leads.length > 0 ? (
            <LeadsTable
              leads={leads}
              pagination={pagination}
              role={user?.role}
              onDelete={(id) => void deleteLead(id)}
              onPageChange={(page) => setFilters({ page })}
              onStatusChange={(id, status) => void updateStatusOptimistic(id, status).catch(() => undefined)}
            />
          ) : null}
        </section>
        <aside>
          <LeadForm onSubmit={createLead} />
        </aside>
      </div>
    </div>
  );
};
