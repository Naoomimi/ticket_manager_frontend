import React, { useState } from "react";
import AdminHeader from "../components/Header/AdminHeader";
import { useAuth } from "../auth/AuthContext";
import TicketsBoard from "../components/Board/TicketBoard";
import CreateTicketModal from "../components/CreateTicketModal";


import { COLUMN_TO_STATE, columnOrder } from "../hooks/useMyTickets";
import { useAllTicketsBoard } from "../hooks/useAllTickets";


const API_URL = "http://localhost:8080";

const Admin = () => {
  const { user } = useAuth();
  const { columns, setColumns, loading } = useAllTicketsBoard();


  const [openCreate, setOpenCreate] = useState(false);

  const updateTicketStateOnServer = async (ticket, newStateId) => {
    try {
      const body = {
        title: ticket.title,
        description: ticket.description,
        state_id: newStateId,
        priority_id: ticket.priority_id,
        assigned_to_user_id: ticket.assigned_to_user_id,
      };

      await fetch(`${API_URL}/tickets/${ticket.id}`, {
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
      sourceTickets.splice(destination.index, 0, movedTicket);
      setColumns({
        ...columns,
        [sourceCol.id]: { ...sourceCol, tickets: sourceTickets },
      });
      return;
    }

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Admin</h2>
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-500 text-white text-sm font-semibold shadow"
          >
            Create ticket
          </button>
        </div>

        <TicketsBoard
          title="Todos los tiquetes"
          columns={columns}
          columnOrder={columnOrder}
          loading={loading}
          onDragEnd={handleDragEnd}
        />


        <CreateTicketModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          adminUserId={user?.Id}
        />
      </main>
    </div>
  );
};

export default Admin;
