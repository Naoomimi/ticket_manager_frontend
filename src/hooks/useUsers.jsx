import { useEffect, useState } from "react";
import { API_URL } from "../config";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState("");

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setUsersError("");
        try {
            const res = await fetch(`${API_URL}/users`);
            if (!res.ok) throw new Error("Error al obtener usuarios");
            const data = await res.json();
            setUsers(data.users || []);
        } catch (e) {
            setUsersError(e.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loadingUsers, usersError, fetchUsers, setUsers };
}
