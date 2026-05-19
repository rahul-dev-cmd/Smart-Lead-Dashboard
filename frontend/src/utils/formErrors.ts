import type { ZodError } from "zod";

export type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

export const mapZodErrors = <TValues>(error: ZodError<TValues>): FieldErrors<TValues> => {
  const errors: FieldErrors<TValues> = {};

  for (const issue of error.issues) {
    const [field] = issue.path;

    if (typeof field === "string") {
      errors[field as keyof TValues] = issue.message;
    }
  }

  return errors;
};
