import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AdminHeader from "../components/Header/AdminHeader";

const API_URL = "http://localhost:8080";

function roleLabel(rolId) {
    return rolId === 1 ? "Admin" : "User";
}

export default function AdminUsers() {
    const { user } = useAuth();

    // Solo ADMIN
    if (user?.Rol_id !== 1) return <Navigate to="/tiquetes" replace />;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal
    const [open, setOpen] = useState(false);

    // form create
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rolId, setRolId] = useState(2); // 1 admin, 2 user

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users/`);
            if (!res.ok) throw new Error("Error al obtener usuarios");
            const data = await res.json();
            setUsers(data.users || []);
        } catch (err) {
            toast.error(err.message || "No se pudieron cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/users/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    rol_id: Number(rolId),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data.success === false) {
                throw new Error(data.message || "Error creando usuario");
            }

            toast.success("Usuario creado correctamente");
            setOpen(false);
            setName("");
            setEmail("");
            setPassword("");
            setRolId(2);
            fetchUsers();
        } catch (err) {
            toast.error(err.message || "No se pudo crear el usuario");
        }
    };

    const handleDeleteUser = async (id) => {
        // No borrarse a sí mismo
        if (user?.Id === id) {
            toast.error("No puede eliminar su propio usuario admin.");
            return;
        }

        const ok = confirm("¿Seguro que desea eliminar este usuario?");
        if (!ok) return;

        try {
            const res = await fetch(`${API_URL}/users/`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data.success === false) {
                throw new Error(data.message || "Error eliminando usuario");
            }

            toast.success("Usuario eliminado correctamente");
            fetchUsers();
        } catch (err) {
            toast.error(err.message || "No se pudo eliminar el usuario");
        }
    };

    return (
        <div className="min-h-screen bg-[#f3e9ff] flex flex-col">
            <AdminHeader />

            <main className="flex-1 px-6 py-8">
                <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold text-slate-800">
                                Gestión de usuarios
                            </h1>

                            <button
                                onClick={() => setOpen(true)}
                                className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-500 text-white text-sm font-semibold shadow"
                            >
                                Create user
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-200">
                            <table className="min-w-full border-collapse text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                            ID
                                        </th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                            Nombre
                                        </th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                            Email
                                        </th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                            Rol
                                        </th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                            Creación
                                        </th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                            Actualización
                                        </th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td className="px-4 py-4 border-b border-slate-200" colSpan={7}>
                                                Cargando...
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u.Id} className="hover:bg-slate-50">
                                                <td className="px-4 py-2 border-b border-slate-200">{u.Id}</td>
                                                <td className="px-4 py-2 border-b border-slate-200">{u.Name}</td>
                                                <td className="px-4 py-2 border-b border-slate-200">{u.Email}</td>
                                                <td className="px-4 py-2 border-b border-slate-200">{roleLabel(u.Rol_id)}</td>
                                                <td className="px-4 py-2 border-b border-slate-200">{u.Creation_date || "—"}</td>
                                                <td className="px-4 py-2 border-b border-slate-200">{u.Last_update_date || "—"}</td>
                                                <td className="px-4 py-2 border-b border-slate-200">
                                                    <button
                                                        onClick={() => handleDeleteUser(u.Id)}
                                                        disabled={u.Id === user?.Id}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${u.Id === user?.Id
                                                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                                                : "bg-rose-400 hover:bg-rose-500 text-white"
                                                            }`}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}

                                    {!loading && users.length === 0 && (
                                        <tr>
                                            <td className="px-4 py-4 border-b border-slate-200 text-slate-500" colSpan={7}>
                                                No hay usuarios.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* MODAL CREAR USUARIO */}
                    {open && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                            <div className="w-full max-w-md bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                                    <div className="font-semibold text-slate-800">Crear usuario</div>
                                    <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-700">
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleCreateUser} className="p-5 space-y-3">
                                    <input
                                        className="w-full border border-slate-200 rounded-xl p-2"
                                        placeholder="Nombre"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <input
                                        className="w-full border border-slate-200 rounded-xl p-2"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <input
                                        className="w-full border border-slate-200 rounded-xl p-2"
                                        placeholder="Contraseña"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                    <select
                                        className="w-full border border-slate-200 rounded-xl p-2"
                                        value={rolId}
                                        onChange={(e) => setRolId(e.target.value)}
                                    >
                                        <option value={2}>User</option>
                                        <option value={1}>Admin</option>
                                    </select>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="flex-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-white text-sm font-semibold"
                                        >
                                            Crear
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* /MODAL */}
                </div>
            </main>
        </div>
    );
}
