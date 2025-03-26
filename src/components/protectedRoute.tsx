import useLocalStorage from "@/hooks/useLocalStorage";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const [, , removeAuthToken] = useLocalStorage<string | null>(
    "auth-token",
    null
  );
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  useEffect(() => {
    if (isAuthenticated) return;
    removeAuthToken();
  }, [isAuthenticated, removeAuthToken]);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
