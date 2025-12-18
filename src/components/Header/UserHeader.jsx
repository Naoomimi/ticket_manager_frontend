import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const UserHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.Name
    ? user.Name.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToProfile = () => {
    setOpen(false);
    navigate("/perfil");
  };

  return (
   <header className="relative z-50 w-full h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6 shadow-sm">
  <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold hover:bg-purple-600 transition"
        >
          {initials}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden">
            <button
              onClick={goToProfile}
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
            >
              Ver perfil
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default UserHeader;
