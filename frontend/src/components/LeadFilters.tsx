import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { LEAD_SOURCES, LEAD_STATUSES, type LeadFilters as LeadFilterValues } from "../types";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Input";

interface LeadFiltersProps {
  filters: LeadFilterValues;
  isExporting: boolean;
  onChange: (filters: Partial<LeadFilterValues>) => void;
  onExport: () => void;
}

export const LeadFilters = ({ filters, isExporting, onChange, onExport }: LeadFiltersProps) => {
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onChange({ search: debouncedSearch });
  }, [debouncedSearch, onChange]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto] lg:items-end">
        <Input
          label="Search"
          placeholder="Name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select label="Status" value={filters.status ?? ""} onChange={(event) => onChange({ status: event.target.value ? (event.target.value as LeadFilterValues["status"]) : undefined })}>
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Select label="Source" value={filters.source ?? ""} onChange={(event) => onChange({ source: event.target.value ? (event.target.value as LeadFilterValues["source"]) : undefined })}>
          <option value="">All sources</option>
          {LEAD_SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </Select>
        <Select label="Sort" value={filters.sort} onChange={(event) => onChange({ sort: event.target.value as LeadFilterValues["sort"] })}>
          <option value="Latest">Latest</option>
          <option value="Oldest">Oldest</option>
        </Select>
        <div className="flex gap-2">
          <Button className="w-10 px-0 lg:hidden" icon={Search} title="Apply search" type="button" variant="secondary" />
          <Button disabled={isExporting} icon={Download} type="button" variant="secondary" onClick={onExport}>
            {isExporting ? "Exporting..." : "CSV"}
          </Button>
        </div>
      </div>
    </div>
  );
};
