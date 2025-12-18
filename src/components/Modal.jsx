import React, { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Cerrar modal"
      />

      {/* dialog */}
      <div className="relative mx-auto mt-24 w-[92%] max-w-xl rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-slate-100 text-slate-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
