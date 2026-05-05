import { Navigate } from "react-router";
import { auth } from "../lib/api";
import type { ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/admin-giris" replace />;
  }
  return <>{children}</>;
}
