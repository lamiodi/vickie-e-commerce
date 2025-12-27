import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { refresh, getMe } from '@/lib/auth';
import { api } from '@/lib/api';

export const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to refresh token (this sets the access token if successful)
        // If we already have a token, this might be redundant but safe
        if (!api.defaults.headers.common['Authorization']) {
          await refresh();
        }

        // Then fetch user details to check role
        const user = await getMe();
        setIsAuthenticated(true);
        setIsAdmin(user.role === 'admin');
      } catch {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // Don't show loading text
  }

  // Redirect to account (login) if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  // If authenticated but not admin, and trying to access admin route
  // (Assuming this component is only used for admin routes for now based on App.jsx)
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};
