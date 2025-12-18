import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8080";
import toast from "react-hot-toast";

export default function CreateTicketModal({ open, onClose, adminUserId }) {
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priorityId, setPriorityId] = useState(2);
    const [assignedTo, setAssignedTo] = useState("");

    useEffect(() => {
        if (!open) return;

        const loadUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/users`);
                const data = await res.json();
                setUsers(data.users || []);
            } catch {
                toast.error("No se pudieron cargar usuarios");
            }
        };

        loadUsers();
    }, [open]);

    const submit = async (e) => {
        e.preventDefault();

        try {
            const body = {
                title,
                description,
                state_id: 1, // Abierto
                priority_id: Number(priorityId),
                assigned_to_user_id: Number(assignedTo),
                created_by_user_id: adminUserId,
            };

            const res = await fetch(`${API_URL}/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.success === false) {
                throw new Error(data.message || "Error creando ticket");
            }

            toast.success("Ticket creado");
            onClose();
            setTitle(""); setDescription(""); setPriorityId(2); setAssignedTo("");
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="font-semibold text-slate-800">Crear tiquete</div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
                </div>

                <form onSubmit={submit} className="p-5 space-y-3">
                    <input
                        className="w-full border border-slate-200 rounded-xl p-2"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <textarea
                        className="w-full border border-slate-200 rounded-xl p-2"
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                            className="w-full border border-slate-200 rounded-xl p-2"
                            value={priorityId}
                            onChange={(e) => setPriorityId(e.target.value)}
                        >
                            <option value={1}>Baja</option>
                            <option value={2}>Media</option>
                            <option value={3}>Alta</option>
                            <option value={4}>Crítica</option>
                        </select>

                        <select
                            className="w-full border border-slate-200 rounded-xl p-2"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            required
                        >
                            <option value="">Asignar a...</option>
                            {users.map((u) => (
                                <option key={u.Id} value={u.Id}>
                                    {u.Name} ({u.Email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
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
    );
}
