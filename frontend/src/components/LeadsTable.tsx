import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { LEAD_STATUSES, type Lead, type LeadStatus, type Pagination, type UserRole } from "../types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/Button";
import { Select } from "./ui/Input";
import { Table } from "./ui/Table";

interface LeadsTableProps {
  leads: Lead[];
  pagination: Pagination;
  role?: UserRole;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
}

export const LeadsTable = ({ leads, onDelete, onPageChange, onStatusChange, pagination, role }: LeadsTableProps) => (
  <Table
    getKey={(lead) => lead.id}
    items={leads}
    pagination={pagination}
    onPageChange={onPageChange}
    columns={[
      {
        header: "Lead",
        render: (lead) => (
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">{lead.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{lead.email}</p>
          </div>
        )
      },
      { header: "Status", render: (lead) => <StatusBadge status={lead.status} /> },
      { header: "Source", render: (lead) => lead.source },
      { header: "Created", render: (lead) => new Date(lead.createdAt).toLocaleDateString() },
      {
        header: "Change",
        render: (lead) => (
          <Select
            aria-label={`Change status for ${lead.name}`}
            hideLabel
            label="Status"
            className="min-w-36"
            value={lead.status}
            onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)}
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        )
      },
      {
        header: "Actions",
        render: (lead) => (
          <div className="flex items-center gap-2">
            <Link to={`/leads/${lead.id}`}>
              <Button className="w-10 px-0" icon={Eye} title="View lead" type="button" variant="secondary" />
            </Link>
            {role === "Admin" ? (
              <Button
                className="w-10 px-0"
                icon={Trash2}
                title="Delete lead"
                type="button"
                variant="danger"
                onClick={() => onDelete(lead.id)}
              />
            ) : null}
          </div>
        )
      }
    ]}
  />
);
