import { Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { LEAD_SOURCES, LEAD_STATUSES, type LeadFormValues } from "../types";
import { mapZodErrors, type FieldErrors } from "../utils/formErrors";
import { leadFormSchema } from "../utils/validation";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Input";

const emptyLead: LeadFormValues = {
  name: "",
  email: "",
  status: "New",
  source: "Website"
};

export const LeadForm = ({ onSubmit }: { onSubmit: (values: LeadFormValues) => Promise<void> }) => {
  const [values, setValues] = useState<LeadFormValues>(emptyLead);
  const [errors, setErrors] = useState<FieldErrors<LeadFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const parsed = leadFormSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(mapZodErrors(parsed.error));
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
      setValues(emptyLead);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" onSubmit={(event) => void submit(event)}>
      <div>
        <h2 className="text-base font-bold text-slate-950 dark:text-white">Create lead</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Capture the minimum clean data needed for follow-up.</p>
      </div>
      <Input label="Name" error={errors.name} value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} />
      <Input label="Email" error={errors.email} type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Status" error={errors.status} value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as LeadFormValues["status"] }))}>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Select label="Source" error={errors.source} value={values.source} onChange={(event) => setValues((current) => ({ ...current, source: event.target.value as LeadFormValues["source"] }))}>
          {LEAD_SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </Select>
      </div>
      <Button icon={Save} disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving..." : "Save lead"}
      </Button>
    </form>
  );
};
