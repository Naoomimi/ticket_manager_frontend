import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

export const STATE_TO_COLUMN = {
    1: "porHacer",
    2: "enProgreso",
    3: "bloqueados",
    4: "terminados",
    5: "cancelados",
};

export const baseColumns = {
    porHacer: { id: "porHacer", title: "Por hacer", tickets: [] },
    enProgreso: { id: "enProgreso", title: "En progreso", tickets: [] },
    bloqueados: { id: "bloqueados", title: "Bloqueados", tickets: [] },
    cancelados: { id: "cancelados", title: "Cancelados", tickets: [] },
    terminados: { id: "terminados", title: "Terminados", tickets: [] },
};

function emptyColumns() {
    return {
        porHacer: { ...baseColumns.porHacer, tickets: [] },
        enProgreso: { ...baseColumns.enProgreso, tickets: [] },
        bloqueados: { ...baseColumns.bloqueados, tickets: [] },
        cancelados: { ...baseColumns.cancelados, tickets: [] },
        terminados: { ...baseColumns.terminados, tickets: [] },
    };
}

function normalizeTicket(t) {
    return {
        id: t.Id,
        title: t.Title,
        description: t.Description,
        state_id: t.State_id,
        priority_id: t.Priority_id,
        assigned_to_user_id: t.Assigned_to_user_id,
    };
}

function priorityLabelFromId(id) {
    switch (id) {
        case 1: return "Baja";
        case 2: return "Media";
        case 3: return "Alta";
        case 4: return "Crítica";
        default: return "Baja";
    }
}

export function useAllTicketsBoard() {
    const [columns, setColumns] = useState(emptyColumns());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/tickets/`);
                if (!res.ok) throw new Error("Error al obtener tickets");

                const data = await res.json();
                const apiTickets = data.tickets || [];

                const newColumns = emptyColumns();

                apiTickets.forEach((raw) => {
                    const ticket = normalizeTicket(raw);
                    const columnId = STATE_TO_COLUMN[ticket.state_id];
                    if (!columnId) return;

                    newColumns[columnId].tickets.push({
                        ...ticket,
                        priorityLabel: priorityLabelFromId(ticket.priority_id),
                    });
                });

                setColumns(newColumns);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    return { columns, setColumns, loading };
}
