import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { refresh } from "@/lib/auth";
import { api } from "@/lib/api";

export const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if we already have an access token in headers
      if (api.defaults.headers.common["Authorization"]) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Try to refresh
      try {
        await refresh();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/account" replace />;
};
