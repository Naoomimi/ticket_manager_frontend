import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import BoardHeader from "./Board";
import TicketColumn from "./TicketColumn";

export default function TicketsBoard({
  title,
  columns,
  columnOrder,
  loading,
  onDragEnd,
  onTicketClick,
}) {
  return (
    <section className="w-full bg-white rounded-[28px] border border-slate-200 overflow-hidden shadow-sm">
      <BoardHeader title={title} columnOrder={columnOrder} columns={columns} />

      {loading ? (
        <div className="h-[62vh] flex items-center justify-center text-sm text-slate-500">
          Cargando tickets...
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-5 h-[62vh] bg-white">
            {columnOrder.map((colId, idx) => (
              <TicketColumn
                key={colId}
                column={columns[colId]}
                index={idx}
                onTicketClick={onTicketClick}  
              />
            ))}
          </div>
        </DragDropContext>
      )}
    </section>
  );
}
