import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import Spinner from '@/components/Loading/Spinner';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return user?.aud === 'authenticated' ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/signin" />
  );
};

export default ProtectedRoute;
