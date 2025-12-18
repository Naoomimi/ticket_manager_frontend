import { useState } from "react";
import AdminHeader from "../components/TicketHeader";
import { useAuth } from "../auth/AuthContext";
import { API_URL } from "../config";
import { useUsers } from "../hooks/useUsers";
import toast from "react-hot-toast";

function roleLabel(rolId) {
    return rolId === 1 ? "Admin" : "User";
}

function UserManagement() {
    const { user: me } = useAuth();
    const { users, loadingUsers, usersError, fetchUsers } = useUsers();

    // modal create user
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rolId, setRolId] = useState(2); // 1 admin, 2 user

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/users`, {
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

            toast.success("Usuario creado");
            setOpen(false);
            setName(""); setEmail(""); setPassword(""); setRolId(2);
            fetchUsers();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            if (me?.Id === id) {
                toast.error("No puede eliminar su propio usuario admin.");
                return;
            }

            const res = await fetch(`${API_URL}/users`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.success === false) {
                throw new Error(data.message || "Error eliminando usuario");
            }

            toast.success("Usuario eliminado");
            fetchUsers();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
                <AdminHeader />

                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-slate-800">
                            Gestionar usuarios
                        </h1>

                        <button
                            onClick={() => setOpen(true)}
                            className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-500 text-white text-sm font-semibold shadow"
                        >
                            Create user
                        </button>
                    </div>

                    {usersError && (
                        <div className="mb-4 text-sm bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3 py-2">
                            {usersError}
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">UserID</th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">Name</th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">Email</th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">Role</th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">Creation date</th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">Last updated</th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loadingUsers ? (
                                    <tr>
                                        <td className="px-4 py-4 border-b border-slate-200" colSpan={7}>
                                            Cargando usuarios...
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
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-3 py-1 rounded-full bg-amber-300 hover:bg-amber-400 text-xs font-semibold text-slate-800 opacity-60 cursor-not-allowed"
                                                        disabled
                                                        title="Opcional (no requerido por el SRS)"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteUser(u.Id)}
                                                        className="px-3 py-1 rounded-full bg-rose-400 hover:bg-rose-500 text-xs font-semibold text-white"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}

                                {!loadingUsers && users.length === 0 && (
                                    <tr>
                                        <td className="px-4 py-4 border-b border-slate-200 text-slate-500" colSpan={7}>
                                            No hay usuarios.
                                        </td>
                                    </tr>
                                )}

                                {!loadingUsers && users.length > 0 && [...Array(2)].map((_, i) => (
                                    <tr key={`empty-${i}`}>
                                        <td className="px-4 py-4 border-b border-slate-200">&nbsp;</td>
                                        <td className="px-4 py-4 border-b border-slate-200">&nbsp;</td>
                                        <td className="px-4 py-4 border-b border-slate-200">&nbsp;</td>
                                        <td className="px-4 py-4 border-b border-slate-200">&nbsp;</td>
                                        <td className="px-4 py-4 border-b border-slate-200">&nbsp;</td>
                                        <td className="px-4 py-4 border-b border-slate-200">&nbsp;</td>
                                        <td className="px-4 py-4 border-b border-slate-200">&nbsp;</td>
                                    </tr>
                                ))}
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
                                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-700">✕</button>
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
        </div>
    );
}

export default UserManagement;
