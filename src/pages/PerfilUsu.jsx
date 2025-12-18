import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const name = user?.Name || "—";
  const email = user?.Email || "—";
  const isAdmin = user?.Rol_id === 1;

  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const goBack = () => {
    navigate(isAdmin ? "/admin" : "/tiquetes");
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f3e9ff] flex flex-col">
      {/* Header */}
      <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
        <button
          onClick={goBack}
          className="text-sm border border-slate-300 rounded-md px-3 py-1 hover:bg-slate-50"
        >
          Volver
        </button>

        <div className="text-sm font-semibold tracking-wide">Perfil</div>

        <button
          onClick={handleLogout}
          className="text-sm border border-slate-300 rounded-md px-3 py-1 hover:bg-slate-50"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Top section */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-14 w-14 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold shadow-sm">
                {initials || "U"}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">{name}</h1>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      isAdmin
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </div>

                <p className="text-sm text-slate-600">{email}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="text-sm text-slate-600 mb-4">
              Información de la cuenta
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-sm text-slate-600">Nombre</span>
                <span className="text-sm font-medium text-slate-900">
                  {name}
                </span>
              </div>

              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-sm text-slate-600">Email</span>
                <span className="text-sm font-medium text-slate-900">
                  {email}
                </span>
              </div>

              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-sm text-slate-600">Rol</span>
                <span className="text-sm font-medium text-slate-900">
                  {isAdmin ? "Admin" : "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
