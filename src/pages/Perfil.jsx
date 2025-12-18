import React from "react";
import { useAuth } from "../auth/AuthContext";

const Perfil = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f3e9ff] flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 w-[320px]">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Perfil
        </h1>

        <div className="text-sm space-y-2">
          <p><strong>Nombre:</strong> {user?.Name}</p>
          <p><strong>Email:</strong> {user?.Email}</p>
          <p><strong>Rol:</strong> {user?.Rol_id === 1 ? "Admin" : "User"}</p>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
