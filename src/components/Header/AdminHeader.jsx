
import React from "react";

const AdminHeader = () => {
  return (
    <header className="w-full h-16 bg-white border-b border-slate-300 flex items-center justify-between px-6 shadow-sm">
      <div className="text-sm font-semibold tracking-wide">
        ADMIN VIEW
      </div>

      <button className="border border-slate-300 rounded-md px-3 py-1 text-sm hover:bg-slate-100">
        Perfil
      </button>
    </header>
  );
};

export default AdminHeader;
