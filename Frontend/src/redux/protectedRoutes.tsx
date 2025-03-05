import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";

interface ProtectedRouteProps {
  requireMentor?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireMentor, requireAdmin }) => {
  const { token, isMentor, isAdmin } = useSelector((state: RootState) => state.auth);

  // If user is not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a mentor is required but user isn't a mentor, redirect to unauthorized
  if (requireMentor && !isMentor) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If an admin is required but user isn't an admin, redirect to unauthorized
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
