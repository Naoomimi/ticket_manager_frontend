import React from "react";
import AdminHeader from "../components/Header/AdminHeader";
import { useAuth } from "../auth/AuthContext";
import TicketsBoard from "../components/Board/TicketBoard";
import {
  useMyTicketsBoard,
  COLUMN_TO_STATE,
  columnOrder,
} from "../hooks/useMyTickets";

// EDITE ESTA PAGINA CON SUS CMABIOS YA SÍ, KIANY. Yo solo pegué y copié el diseño de la pagina Tiquetes
const API_URL = "http://localhost:8080";

const Admin = () => {
  const { user } = useAuth();
  const { columns, setColumns, loading } = useMyTicketsBoard(user);

  const updateTicketStateOnServer = async (ticket, newStateId) => {
    try {
      const body = {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        state_id: newStateId,
        priority_id: ticket.priority_id,
        assigned_to_user_id: ticket.assigned_to_user_id,
      };

      await fetch(`${API_URL}/tickets`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("Error actualizando ticket en backend:", err);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceTickets = [...sourceCol.tickets];
    const [movedTicket] = sourceTickets.splice(source.index, 1);

    if (sourceCol.id === destCol.id) {
      // reorden en misma columna
      sourceTickets.splice(destination.index, 0, movedTicket);
      setColumns({
        ...columns,
        [sourceCol.id]: { ...sourceCol, tickets: sourceTickets },
      });
      return;
    }

    // mover entre columnas
    const destTickets = [...destCol.tickets];
    const newStateId = COLUMN_TO_STATE[destCol.id];

    const moved = { ...movedTicket, state_id: newStateId };
    destTickets.splice(destination.index, 0, moved);

    setColumns({
      ...columns,
      [sourceCol.id]: { ...sourceCol, tickets: sourceTickets },
      [destCol.id]: { ...destCol, tickets: destTickets },
    });

    updateTicketStateOnServer(movedTicket, newStateId);
  };

  return (
    <div className="min-h-screen bg-[#f3e9ff] flex flex-col">
      <AdminHeader />

      <main className="flex-1 px-6 py-8">
        <TicketsBoard
          title="Mis tiquetes"
          columns={columns}
          columnOrder={columnOrder}
          loading={loading}
          onDragEnd={handleDragEnd}
        />
      </main>
    </div>
  );
};

export default Admin;
