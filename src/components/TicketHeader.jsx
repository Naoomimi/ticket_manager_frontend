// src/components/AdminHeader.jsx
import { NavLink } from "react-router-dom";

function TicketHeader() {
    return (
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50">
            <span className="font-semibold text-sm tracking-wide text-slate-600">
                ADMIN VIEW
            </span>

            <div className="flex items-center gap-2 text-sm">
                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        [
                            "px-3 py-1 rounded-full border text-xs font-medium",
                            isActive
                                ? "bg-white border-slate-400 text-slate-800 shadow-sm"
                                : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100",
                        ].join(" ")
                    }
                >
                    Usuarios
                </NavLink>

                <NavLink
                    to="/admin/profile"
                    className={({ isActive }) =>
                        [
                            "px-3 py-1 rounded-full text-xs font-medium",
                            isActive
                                ? "bg-white border border-slate-400 text-slate-800 shadow-sm"
                                : "text-slate-500 hover:bg-slate-100",
                        ].join(" ")
                    }
                >
                    Perfil
                </NavLink>
            </div>
        </div>
    );
}

export default TicketHeader;
