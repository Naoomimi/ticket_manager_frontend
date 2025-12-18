import React from "react";

export default function BoardHeader({ title, columnOrder, columns }) {
  return (
    <>
      <div className="py-5 text-center border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold tracking-wide">{title}</h1>
      </div>

<div className="grid grid-cols-5 text-center text-sm border-b border-slate-200 bg-white">
  {columnOrder.map((colId) => (
    <div key={colId} className="py-3 font-medium text-slate-700">
      {columns[colId].title}
    </div>
  ))}
</div>

    </>
  );
}
