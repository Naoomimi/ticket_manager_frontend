
import { useState } from "react";
import AdminHeader from "../components/TicketHeader";

const initialUsers = [
    {
        id: 1,
        name: "user1",
        email: "user1@gmail.com",
        role: "Standard",
        createdAt: "YYYYMMDD",
        updatedAt: "YYYYMMDD",
    },
];

function UserManagement() {
    const [users] = useState(initialUsers);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
                {/* Header reutilizable */}
                <AdminHeader />

                {/* Contenido específico de esta página */}
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-slate-800">
                            Gestionar usuarios
                        </h1>

                        <button className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-500 text-white text-sm font-semibold shadow">
                            Create user
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                        UserID
                                    </th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                        Role
                                    </th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                        Creation date
                                    </th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                        Last updated
                                    </th>
                                    <th className="px-4 py-2 border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 border-b border-slate-200">
                                            {u.id}
                                        </td>
                                        <td className="px-4 py-2 border-b border-slate-200">
                                            {u.name}
                                        </td>
                                        <td className="px-4 py-2 border-b border-slate-200">
                                            {u.email}
                                        </td>
                                        <td className="px-4 py-2 border-b border-slate-200">
                                            {u.role}
                                        </td>
                                        <td className="px-4 py-2 border-b border-slate-200">
                                            {u.createdAt}
                                        </td>
                                        <td className="px-4 py-2 border-b border-slate-200">
                                            {u.updatedAt}
                                        </td>
                                        <td className="px-4 py-2 border-b border-slate-200">
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 rounded-full bg-amber-300 hover:bg-amber-400 text-xs font-semibold text-slate-800">
                                                    Edit
                                                </button>
                                                <button className="px-3 py-1 rounded-full bg-rose-400 hover:bg-rose-500 text-xs font-semibold text-white">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {[...Array(4)].map((_, i) => (
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
            </div>
        </div>
    );
}

export default UserManagement;
