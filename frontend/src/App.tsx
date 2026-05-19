import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastViewport } from "./components/ui/Toast";
import { useAuth } from "./hooks/useAuth";
import { Dashboard } from "./pages/Dashboard";
import { LeadDetails } from "./pages/LeadDetails";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const App = () => {
  const { bootstrap } = useAuth();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <ToastViewport />
    </>
  );
};
