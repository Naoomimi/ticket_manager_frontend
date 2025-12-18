import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  //Si no hay usuario logueado entonces aquí lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //Si sí hay usuario le mostramos la página protegida
  return children;
}
