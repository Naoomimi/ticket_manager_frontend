const TicketCard = ({ title, description, priority, onClick }) => {
  const priorityColorMap = {
    Baja: "text-emerald-700",
    Media: "text-amber-600",
    Alta: "text-red-600",
  };

  const textPriorityColor = priorityColorMap[priority] || "text-slate-600";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="
        bg-slate-50 rounded-3xl shadow-sm px-4 py-3 mb-4 border border-slate-300
        flex flex-col justify-between min-h-[120px] max-w-[180px]
        transition
        hover:shadow-md hover:border-slate-400
        cursor-pointer
      "
    >
      <div>
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        <p className="text-[11px] leading-snug text-slate-700 line-clamp-4">
          {description}
        </p>
      </div>

      <div className="mt-2 text-right">
        <span className={`text-xs font-semibold ${textPriorityColor}`}>
          {priority}
        </span>
      </div>
    </div>
  );
};

export default TicketCard;
