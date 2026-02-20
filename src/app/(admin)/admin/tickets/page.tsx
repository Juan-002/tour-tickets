import { ticketService } from "@/services/ticketService";
import { TicketStatus } from "@/types";
import CancelTicketButton from "@/components/ui/CancelTicketButton";

const statusStyle: Record<string, string> = {
  CONFIRMED: "bg-amber-400/10 text-amber-400 border border-amber-400/25",
  PENDING:   "bg-yellow-400/10 text-yellow-400 border border-yellow-400/25",
  CANCELLED: "bg-red-400/10 text-red-400 border border-red-400/25",
};
const statusLabel: Record<string, string> = {
  CONFIRMED: "Confirmado",
  PENDING:   "Pendiente",
  CANCELLED: "Cancelado",
};

export default async function AdminTicketsPage() {
  const tickets = await ticketService.getAll();

  const totalRevenue = tickets
    .filter((t) => t.status === TicketStatus.CONFIRMED)
    .reduce((acc, t) => acc + t.totalPrice, 0);

  const confirmed = tickets.filter((t) => t.status === TicketStatus.CONFIRMED).length;
  const pending   = tickets.filter((t) => t.status === TicketStatus.PENDING).length;
  const cancelled = tickets.filter((t) => t.status === TicketStatus.CANCELLED).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <p className="text-[0.68rem] tracking-[0.25em] uppercase text-[#C4903E] font-sans mb-2">✦ Gestión</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#F5EDD8]">
          Tiquetes <span className="italic text-[#C4903E]">vendidos</span>
        </h2>
        <p className="mt-1 font-sans text-sm text-white/35">
          {tickets.length} {tickets.length === 1 ? "tiquete registrado" : "tiquetes registrados"}
        </p>
      </div>

      {/* Stats — 2 cols móvil, 4 cols desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Ingresos",    value: `$${totalRevenue.toLocaleString("es-CO")}`, color: "#C4903E" },
          { label: "Confirmados", value: confirmed, color: "#f59e0b" },
          { label: "Pendientes",  value: pending,   color: "#facc15" },
          { label: "Cancelados",  value: cancelled,  color: "#f87171" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] p-4 sm:p-5">
            <p className="font-serif text-xl font-black sm:text-2xl" style={{ color: s.color }}>{s.value}</p>
            <p className="font-sans text-[0.65rem] text-white/35 tracking-widest uppercase mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.07] flex flex-col items-center gap-4 py-20 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.3)" strokeWidth="1">
            <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
            <path d="M12 22V7"/>
          </svg>
          <p className="font-serif text-xl font-bold text-white/50">No hay tiquetes aún</p>
          <p className="font-sans text-sm text-white/25">Las ventas aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <>
          {/* ── MÓVIL: Cards ─────────────────────────────── */}
          <div className="flex flex-col gap-3 md:hidden">
            {tickets.map((ticket) => {
              const tour = ticket.tour as { title?: string } | undefined;
              const user = ticket.user as { name?: string; email?: string } | undefined;
              const date = new Date(ticket.createdAt).toLocaleDateString("es-CO", {
                day: "2-digit", month: "short", year: "numeric",
              });

              return (
                <div key={ticket.id} className="bg-white/[0.02] border border-white/[0.07] p-4 flex flex-col gap-3">

                  {/* Tour + estado */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium truncate text-white/80">{tour?.title ?? "—"}</p>
                      <p className="font-sans text-[0.65rem] text-white/25 tracking-wider mt-0.5">
                        ID: {ticket.id.slice(0, 8)}...
                      </p>
                    </div>
                    <span className={`text-[0.6rem] tracking-widest uppercase font-sans px-2.5 py-1 shrink-0 ${statusStyle[ticket.status]}`}>
                      {statusLabel[ticket.status]}
                    </span>
                  </div>

                  {/* Usuario */}
                  <div className="flex items-center gap-2 py-2 border-t border-white/[0.05]">
                    <div className="w-7 h-7 bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                      <span className="font-sans text-xs text-white/50">
                        {user?.name?.charAt(0).toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm truncate text-white/70">{user?.name ?? "—"}</p>
                      <p className="font-sans text-xs truncate text-white/30">{user?.email ?? ""}</p>
                    </div>
                  </div>

                  {/* Total, personas, fecha */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.05]">
                    <div>
                      <p className="font-sans text-[0.6rem] text-white/30 tracking-widest uppercase mb-1">Total</p>
                      <p className="font-serif text-sm font-bold text-[#C4903E]">${ticket.totalPrice.toLocaleString("es-CO")}</p>
                    </div>
                    <div>
                      <p className="font-sans text-[0.6rem] text-white/30 tracking-widest uppercase mb-1">Personas</p>
                      <p className="font-sans text-sm text-white/60">{ticket.quantity}</p>
                    </div>
                    <div>
                      <p className="font-sans text-[0.6rem] text-white/30 tracking-widest uppercase mb-1">Fecha</p>
                      <p className="font-sans text-xs leading-tight text-white/40">{date}</p>
                    </div>
                  </div>

                  {/* Acción */}
                  {ticket.status !== TicketStatus.CANCELLED && (
                    <div className="pt-1">
                      <CancelTicketButton ticketId={ticket.id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── DESKTOP: Tabla ───────────────────────────── */}
          <div className="hidden md:block bg-white/[0.02] border border-white/[0.07] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["ID", "Tour", "Usuario", "Personas", "Total", "Estado", "Fecha", "Acciones"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[0.65rem] tracking-[0.18em] uppercase text-white/30 font-sans font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {tickets.map((ticket) => {
                  const tour = ticket.tour as { title?: string } | undefined;
                  const user = ticket.user as { name?: string; email?: string } | undefined;
                  const date = new Date(ticket.createdAt).toLocaleDateString("es-CO", {
                    day: "2-digit", month: "short", year: "numeric",
                  });

                  return (
                    <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 py-4">
                        <span className="font-sans text-[0.65rem] text-white/25 tracking-wider">
                          {ticket.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <p className="font-sans text-sm text-white/80 max-w-[160px] truncate">{tour?.title ?? "—"}</p>
                      </td>
                      <td className="px-3 py-4">
                        <p className="font-sans text-sm text-white/70">{user?.name ?? "—"}</p>
                        <p className="font-sans text-xs text-white/30">{user?.email ?? ""}</p>
                      </td>
                      <td className="px-3 py-4 font-sans text-sm text-center text-white/60">{ticket.quantity}</td>
                      <td className="px-3 py-4 font-serif text-sm font-bold text-[#C4903E] whitespace-nowrap">
                        ${ticket.totalPrice.toLocaleString("es-CO")}
                      </td>
                      <td className="px-3 py-4">
                        <span className={`text-[0.6rem] tracking-widest uppercase font-sans px-2.5 py-1 whitespace-nowrap ${statusStyle[ticket.status]}`}>
                          {statusLabel[ticket.status]}
                        </span>
                      </td>
                      <td className="px-3 py-4 font-sans text-xs text-white/35 whitespace-nowrap">{date}</td>
                      <td className="px-3 py-4">
                        {ticket.status !== TicketStatus.CANCELLED && (
                          <CancelTicketButton ticketId={ticket.id} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}