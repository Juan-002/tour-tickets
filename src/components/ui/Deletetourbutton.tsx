"use client";

export default function DeleteTourButton({ tourId, tourTitle }: { tourId: string; tourTitle: string }) {
  async function handleDelete() {
    if (!confirm(`¿Eliminar "${tourTitle}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/tours/${tourId}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
    else {
      const json = await res.json();
      alert(json.error ?? "Error al eliminar el tour");
    }
  }
  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-white/30 border border-white/[0.07] hover:border-red-400/40 hover:text-red-400 transition-colors"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>
      Eliminar
    </button>
  );
}