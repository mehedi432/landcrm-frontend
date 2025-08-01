// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Optional: show spinner or loading screen

  const isAuthPage = location.pathname.startsWith("/authentication");

  // Unauthenticated & accessing protected route → redirect to login
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/authentication/login/creative" replace />;
  }

  // Authenticated & accessing an auth page → redirect to dashboard
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/properties/landlist" replace />;
  }

  return children;
};

export default ProtectedRoute;