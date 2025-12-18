import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
const u = await login(email, password);

if (u.Rol_id === 1) navigate("/admin");
else navigate("/tiquetes");
    } catch (err) {
      toast.error(err.message || "Error al iniciar sesión");
    }
  };


  return (
  <div className="min-h-screen flex items-center justify-center bg-[#f3e8ff]">
    <div className="relative w-[320px] bg-white rounded-3xl shadow-md px-10 py-10 flex flex-col items-stretch">
      {/* Sketchy border effect */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-slate-300" />

      <h1 className="relative text-center text-3xl mb-8 font-semibold tracking-wide">
        Login
      </h1>

      <form className="relative flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700 text-left">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-8 rounded-md border border-slate-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700 text-left">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-8 rounded-md border border-slate-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <button
          type="submit"
          className="mt-4 mx-auto w-28 h-8 rounded-md border border-slate-300 text-sm hover:bg-slate-100 active:scale-[0.98] transition"
        >
          Enter
        </button>
      </form>
    </div>
  </div>
);
};

export default Login;
