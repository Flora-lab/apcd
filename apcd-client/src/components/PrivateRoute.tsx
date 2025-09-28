// Correct avec type-only import
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type PrivateRouteProps = {
  children: ReactNode;
  admin?: boolean;
};

export default function PrivateRoute({ children, admin = false }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (admin && user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
