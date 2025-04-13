import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Spinner from "@/components/Loading/Spinner";

type PublicRouteProps = {
  children: ReactNode;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return user?.aud === "authenticated" ? <Navigate to="/" /> : <>{children}</>;
};

export default PublicRoute;
