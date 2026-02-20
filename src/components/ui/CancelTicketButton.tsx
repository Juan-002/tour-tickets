"use client";

export default function CancelTicketButton({ ticketId }: { ticketId: string }) {
  async function handleCancel() {
    if (!confirm("¿Cancelar este tiquete? Se restaurarán los cupos del tour.")) return;
    const res = await fetch(`/api/tickets/${ticketId}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
    else {
      const json = await res.json();
      alert(json.error ?? "Error al cancelar el tiquete");
    }
  }

  return (
    <button
      onClick={handleCancel}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-white/30 border border-white/[0.07] hover:border-red-400/40 hover:text-red-400 transition-colors"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      Cancelar
    </button>
  );
}