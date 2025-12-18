import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();

  // Wait for initialization to complete before checking authentication
  // This prevents redirecting to login during page refresh while checking localStorage
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    );
  }

  //Si no hay usuario logueado entonces aquí lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //Si sí hay usuario le mostramos la página protegida
  return children;
}
