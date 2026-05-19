import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ErrorFallback } from "../components/ErrorFallback";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Input";
import { useLeadsStore } from "../store/useLeadsStore";
import { LEAD_STATUSES, type LeadStatus } from "../types";

export const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { error, fetchLead, isLoading, selectedLead, updateStatusOptimistic } = useLeadsStore();

  useEffect(() => {
    if (id) {
      void fetchLead(id);
    }
  }, [fetchLead, id]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorFallback message={error} />;
  }

  if (!selectedLead) {
    return <ErrorFallback message="Lead details could not be loaded." />;
  }

  return (
    <div className="grid max-w-3xl gap-4">
      <Link to="/">
        <Button icon={ArrowLeft} type="button" variant="secondary">
          Back
        </Button>
      </Link>
      <section className="rounded-md border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold">{selectedLead.name}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{selectedLead.email}</p>
          </div>
          <StatusBadge status={selectedLead.status} />
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Source</dt>
            <dd className="mt-1 font-semibold">{selectedLead.source}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Created</dt>
            <dd className="mt-1 font-semibold">{new Date(selectedLead.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Updated</dt>
            <dd className="mt-1 font-semibold">{new Date(selectedLead.updatedAt).toLocaleString()}</dd>
          </div>
          <Select
            label="Pipeline status"
            value={selectedLead.status}
            onChange={(event) => void updateStatusOptimistic(selectedLead.id, event.target.value as LeadStatus)}
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </dl>
      </section>
    </div>
  );
};
