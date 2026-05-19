import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DashboardSkeleton } from "./DashboardSkeleton";

export const ProtectedRoute = () => {
  const { accessToken, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <DashboardSkeleton />;
  }

  return accessToken ? <Outlet /> : <Navigate replace to="/login" />;
};
