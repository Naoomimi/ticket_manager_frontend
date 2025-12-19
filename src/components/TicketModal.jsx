import React, { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "./Modal";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

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
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const assignedName = useMemo(() => {
    if (!ticket) return "—";
    return usersById?.[ticket.Assigned_to_user_id] ?? `User #${ticket.Assigned_to_user_id}`;
  }, [ticket, usersById]);

  const createdByName = useMemo(() => {
    if (!ticket) return "—";
    return usersById?.[ticket.Created_by_user_id] ?? `User #${ticket.Created_by_user_id}`;
  }, [ticket, usersById]);

  const fetchComments = useCallback(async () => {
    try {
      const cRes = await fetch(`${API_URL}/comments/`);
      const cData = await cRes.json();
      const all = cData.comments || [];
      const mine = all.filter((c) => c.Ticket_id === ticketId || c.ticket_id === ticketId);
      setComments(mine);
    } catch (e) {
      console.error(e);
    }
  }, [ticketId]);

  useEffect(() => {
    if (!open || !ticketId) return;

    const run = async () => {
      setLoading(true);
      try {
        // 1) ticket
        const tRes = await fetch(`${API_URL}/tickets/${ticketId}`);
        const tData = await tRes.json();
        const t = (tData.tickets && tData.tickets[0]) ? tData.tickets[0] : null;
        setTicket(t);

        // 2) comments
        await fetchComments();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open, ticketId, fetchComments]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const body = {
        content: newComment.trim(),
        ticket_id: ticketId,
        created_by_user_id: user.Id || user.id,
      };

      const res = await fetch(`${API_URL}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Error creando comentario");
      }

      toast.success("Comentario creado");
      setNewComment("");
      await fetchComments();
    } catch (err) {
      toast.error(err.message || "No se pudo crear el comentario");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.Id || comment.id);
    setEditingCommentText(comment.Content || comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentText.trim()) return;

    try {
      const body = {
        "content": editingCommentText.trim(),
      };

      const res = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        console.log(data.message)
        throw new Error(data.message || "Error actualizando comentario");
      }

      toast.success("Comentario actualizado");
      setEditingCommentId(null);
      setEditingCommentText("");
      await fetchComments();
    } catch (err) {
      toast.error(err.message || "No se pudo actualizar el comentario");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) return;

    try {
      const res = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        console.log(data.message)
        throw new Error(data.message || "Error eliminando comentario");
      }

      toast.success("Comentario eliminado");
      await fetchComments();
    } catch (err) {
      toast.error(err.message || "No se pudo eliminar el comentario");
    }
  };

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
              <div className="space-y-2 mb-4">
                {comments.map((c) => {
                  const commentId = c.Id || c.id;
                  const isEditing = editingCommentId === commentId;
                  const author =
                    usersById?.[c.Created_by_user_id]?.Name ??
                    usersById?.[c.created_by_user_id]?.Name ??
                    `User #${c.Created_by_user_id || c.created_by_user_id}`;

                  return (
                    <div
                      key={commentId}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-xs text-slate-500">{author}</div>
                        {!isEditing && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleStartEdit(c)}
                              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteComment(commentId)}
                              className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingCommentText}
                            onChange={(e) => setEditingCommentText(e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            rows="3"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleCancelEdit}
                              className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-100 transition"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateComment(commentId)}
                              className="text-xs px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm">{c.Content || c.content}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleCreateComment} className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                rows="3"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition active:scale-[0.98]"
                >
                  Agregar comentario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}
