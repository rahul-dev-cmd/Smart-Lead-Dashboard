import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { USER_ROLES, type UserRole } from "../types";
import { mapZodErrors, type FieldErrors } from "../utils/formErrors";
import { registerSchema, type RegisterFormValues } from "../utils/validation";

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  role: "Sales User"
};

export const Register = () => {
  const { accessToken, error, isSubmitting, register } = useAuth();
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<RegisterFormValues>>({});

  if (accessToken) {
    return <Navigate replace to="/" />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(mapZodErrors(parsed.error));
      return;
    }

    setErrors({});
    await register(parsed.data.name, parsed.data.email, parsed.data.password, parsed.data.role);
  };

  return (
    <AuthShell title="Create account" subtitle="Start with Admin or Sales User access">
      <form className="grid gap-4" onSubmit={(event) => void onSubmit(event)}>
        <Input error={errors.name} label="Name" value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} />
        <Input error={errors.email} label="Email" type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} />
        <Input error={errors.password} label="Password" type="password" value={values.password} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} />
        <Select error={errors.role} label="Role" value={values.role} onChange={(event) => setValues((current) => ({ ...current, role: event.target.value as UserRole }))}>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>
        {error ? <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p> : null}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already registered?{" "}
          <Link className="font-semibold text-emerald-700 dark:text-emerald-300" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};
