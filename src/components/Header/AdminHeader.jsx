import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function AdminHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const goPerfil = () => navigate("/perfil");
  const goTickets = () => navigate("/admin");
  const goUsers = () => navigate("/admin/users");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold tracking-wide">
          Admin Panel
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={goTickets}
            className="text-sm border border-slate-300 rounded-md px-3 py-1 hover:bg-slate-50"
          >
            Tickets
          </button>
          <button
            onClick={goUsers}
            className="text-sm border border-slate-300 rounded-md px-3 py-1 hover:bg-slate-50"
          >
            Usuarios
          </button>
          <button
            onClick={goPerfil}
            className="text-sm border border-slate-300 rounded-md px-3 py-1 hover:bg-slate-50"
          >
            Perfil
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-600 hidden md:block">
          {user?.Name || "Admin"}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm border border-slate-300 rounded-md px-3 py-1 hover:bg-slate-50"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
