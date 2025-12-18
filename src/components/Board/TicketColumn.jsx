import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TicketCard from "../TicketCard";

export default function TicketColumn({ column, onTicketClick }) {
  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="border-r last:border-r-0 border-slate-200 flex flex-col items-center pt-4 overflow-y-auto"
        >
          {column.tickets.map((ticket, index) => (
            <Draggable
              key={ticket.id}
              draggableId={ticket.id.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TicketCard
                    title={ticket.title}
                    description={ticket.description}
                    priority={ticket.priorityLabel}
                    onClick={() => onTicketClick?.(ticket.id)}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
