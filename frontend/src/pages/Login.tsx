import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { mapZodErrors, type FieldErrors } from "../utils/formErrors";
import { loginSchema, type LoginFormValues } from "../utils/validation";

const initialValues: LoginFormValues = {
  email: "",
  password: ""
};

export const Login = () => {
  const { accessToken, error, isSubmitting, login } = useAuth();
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<LoginFormValues>>({});

  if (accessToken) {
    return <Navigate replace to="/" />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(mapZodErrors(parsed.error));
      return;
    }

    setErrors({});
    await login(parsed.data.email, parsed.data.password);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage lead flow">
      <form className="grid gap-4" onSubmit={(event) => void onSubmit(event)}>
        <Input
          autoComplete="email"
          error={errors.email}
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
        />
        <Input
          autoComplete="current-password"
          error={errors.password}
          label="Password"
          type="password"
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
        />
        {error ? <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p> : null}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New here?{" "}
          <Link className="font-semibold text-emerald-700 dark:text-emerald-300" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};
