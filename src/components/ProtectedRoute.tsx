import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';

export function ProtectedRoute({ children, superAdminOnly = false }: { children: React.ReactNode, superAdminOnly?: boolean }) {
  const { token, user, isLoading } = useAdmin();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (superAdminOnly && user.role !== 'super_admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
