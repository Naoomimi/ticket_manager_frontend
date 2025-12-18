import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

const API_URL = "http://localhost:8080";

function priorityText(id) {
  switch (id) {
    case 1: return "Baja";
    case 2: return "Media";
    case 3: return "Alta";
    case 4: return "Crítica";
    default: return "Baja";
  }
}

function stateText(id) {
  switch (id) {
    case 1: return "Por hacer";
    case 2: return "En progreso";
    case 3: return "Bloqueados";
    case 4: return "Terminados";
    case 5: return "Cancelados";
    default: return "—";
  }
}

export default function TicketModal({ open, onClose, ticketId, usersById }) {
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const assignedName = useMemo(() => {
    if (!ticket) return "—";
    return usersById?.[ticket.Assigned_to_user_id]?.Name ?? `User #${ticket.Assigned_to_user_id}`;
  }, [ticket, usersById]);

  const createdByName = useMemo(() => {
    if (!ticket) return "—";
    return usersById?.[ticket.Created_by_user_id]?.Name ?? `User #${ticket.Created_by_user_id}`;
  }, [ticket, usersById]);

  useEffect(() => {
    if (!open || !ticketId) return;

    const run = async () => {
      setLoading(true);
      try {
        // 1) ticket
        const tRes = await fetch(`${API_URL}/tickets?id=${ticketId}`);
        const tData = await tRes.json();
        const t = (tData.tickets && tData.tickets[0]) ? tData.tickets[0] : null;
        setTicket(t);

        // 2) comments (si tu backend no filtra, filtramos aquí)
        const cRes = await fetch(`${API_URL}/comments`);
        const cData = await cRes.json();
        const all = cData.comments || [];
        const mine = all.filter((c) => c.Ticket_id === ticketId || c.ticket_id === ticketId);
        setComments(mine);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open, ticketId]);

  return (
    <Modal open={open} onClose={onClose} title={`Ticket #${ticketId}`}>
      {loading || !ticket ? (
        <div className="text-sm text-slate-500">Cargando...</div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-lg font-semibold">{ticket.Title}</div>
            <div className="text-sm text-slate-600 mt-1">{ticket.Description}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-slate-500">Estado</div>
              <div className="font-medium">{stateText(ticket.State_id)}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-slate-500">Prioridad</div>
              <div className="font-medium">{priorityText(ticket.Priority_id)}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-slate-500">Asignado a</div>
              <div className="font-medium">{assignedName}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-slate-500">Creado por</div>
              <div className="font-medium">{createdByName}</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-sm font-semibold mb-2">Comentarios</div>

            {comments.length === 0 ? (
              <div className="text-sm text-slate-500">No hay comentarios.</div>
            ) : (
              <div className="space-y-2">
                {comments.map((c) => {
                  const author =
                    usersById?.[c.Created_by_user_id]?.Name ??
                    usersById?.[c.created_by_user_id]?.Name ??
                    `User #${c.Created_by_user_id || c.created_by_user_id}`;

                  return (
                    <div
                      key={c.Id || c.id}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="text-xs text-slate-500 mb-1">{author}</div>
                      <div className="text-sm">{c.Content || c.content}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
