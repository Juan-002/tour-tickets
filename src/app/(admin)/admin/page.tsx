//Dashboard admin
import { tourService } from "@/services/tourService";
import { ticketService } from "@/services/ticketService";
import { TourStatus, TicketStatus } from "@/types";

export default async function AdminDashboardPage() {
  const [tours, tickets] = await Promise.all([
    tourService.getAll(),
    ticketService.getAll(),
  ]);

  const totalRevenue     = tickets.filter((t) => t.status === TicketStatus.CONFIRMED).reduce((acc, t) => acc + t.totalPrice, 0);
  const activeTours      = tours.filter((t) => t.status === TourStatus.ACTIVE).length;
  const soldOutTours     = tours.filter((t) => t.status === TourStatus.SOLDOUT).length;
  const confirmedTickets = tickets.filter((t) => t.status === TicketStatus.CONFIRMED).length;
  const totalPeople      = tickets.filter((t) => t.status === TicketStatus.CONFIRMED).reduce((acc, t) => acc + t.quantity, 0);

  const recentTickets = tickets.slice(0, 5);
  const recentTours   = tours.slice(0, 5);

  const stats = [
    {
      label: "Ingresos totales",
      value: `$${totalRevenue.toLocaleString("es-CO")}`,
      sub:   `${confirmedTickets} ventas confirmadas`,
      icon:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      accent: "#C4903E",
    },
    {
      label: "Tours activos",
      value: activeTours,
      sub:   `${soldOutTours} agotados`,
      icon:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
      accent: "#4ade80",
    },
    {
      label: "Total tiquetes",
      value: tickets.length,
      sub:   `${confirmedTickets} confirmados`,
      icon:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/></svg>,
      accent: "#60a5fa",
    },
    {
      label: "Personas totales",
      value: totalPeople,
      sub:   "en tours confirmados",
      icon:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      accent: "#c084fc",
    },
  ];

  const ticketStatusStyle: Record<string, string> = {
    CONFIRMED: "bg-amber-400/10 text-amber-400 border border-amber-400/25",
    PENDING:   "bg-yellow-400/10 text-yellow-400 border border-yellow-400/25",
    CANCELLED: "bg-red-400/10 text-red-400 border border-red-400/25",
  };
  const ticketStatusLabel: Record<string, string> = {
    CONFIRMED: "Confirmado", PENDING: "Pendiente", CANCELLED: "Cancelado",
  };
  const tourStatusStyle: Record<string, string> = {
    ACTIVE:   "bg-green-400/10 text-green-400 border border-green-400/25",
    SOLDOUT:  "bg-red-400/10 text-red-400 border border-red-400/25",
    INACTIVE: "bg-white/5 text-white/30 border border-white/10",
  };
  const tourStatusLabel: Record<string, string> = {
    ACTIVE: "Activo", SOLDOUT: "Agotado", INACTIVE: "Inactivo",
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">

      {/* Welcome */}
      <div>
        <p className="text-[0.68rem] tracking-[0.25em] uppercase text-[#C4903E] font-sans mb-2">✦ Bienvenido</p>
        <h2 className="font-serif text-3xl font-black sm:text-4xl">
          Dashboard <span className="italic text-[#C4903E]">general</span>
        </h2>
        <p className="mt-2 font-sans text-sm text-white/35">Resumen del estado actual del sistema.</p>
      </div>

      {/* Stats — 2 cols móvil, 4 cols desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="bg-white/[0.03] border border-white/[0.07] p-4 sm:p-6 hover:border-white/[0.12] transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 shrink-0" style={{ border: `1px solid ${s.accent}25` }}>
                {s.icon}
              </div>
              <span className="text-[0.55rem] tracking-widest uppercase font-sans px-1.5 py-0.5 border hidden sm:inline" style={{ color: s.accent, borderColor: `${s.accent}25`, background: `${s.accent}10` }}>
                Live
              </span>
            </div>
            <p className="font-serif text-xl font-black sm:text-3xl" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-[0.65rem] text-white/40 font-sans mt-1 tracking-wide">{s.label}</p>
            <p className="text-[0.62rem] text-white/25 font-sans mt-0.5 hidden sm:block">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tables — 1 col móvil, 2 cols desktop */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6">

        {/* Últimas ventas */}
        <div className="bg-white/[0.02] border border-white/[0.07]">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06]">
            <p className="font-serif text-base font-bold">Últimas ventas</p>
            <a href="/admin/tickets" className="text-[0.68rem] text-[#C4903E] hover:underline font-sans tracking-wide">Ver todas →</a>
          </div>
          {recentTickets.length === 0 ? (
            <div className="px-6 py-10 font-sans text-sm text-center text-white/25">No hay ventas aún</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentTickets.map((ticket) => {
                const tour = ticket.tour as { title?: string } | undefined;
                return (
                  <div key={ticket.id} className="flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-white/[0.02] transition-colors gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm truncate text-white/80">{tour?.title ?? "Tour"}</p>
                      <p className="font-sans text-xs text-white/30 mt-0.5">{ticket.quantity} persona{ticket.quantity > 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="font-serif text-sm font-bold text-[#C4903E] whitespace-nowrap">
                        ${ticket.totalPrice.toLocaleString("es-CO")}
                      </p>
                      <span className={`text-[0.55rem] tracking-widest uppercase font-sans px-2 py-0.5 hidden sm:inline ${ticketStatusStyle[ticket.status]}`}>
                        {ticketStatusLabel[ticket.status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tours recientes */}
        <div className="bg-white/[0.02] border border-white/[0.07]">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06]">
            <p className="font-serif text-base font-bold">Tours recientes</p>
            <a href="/admin/tours" className="text-[0.68rem] text-[#C4903E] hover:underline font-sans tracking-wide">Gestionar →</a>
          </div>
          {recentTours.length === 0 ? (
            <div className="px-6 py-10 font-sans text-sm text-center text-white/25">No hay tours creados</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentTours.map((tour) => (
                <div key={tour.id} className="flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-white/[0.02] transition-colors gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm truncate text-white/80">{tour.title}</p>
                    <p className="font-sans text-xs text-white/30 mt-0.5">{tour.availableSlots} / {tour.totalSlots} cupos</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="font-serif text-sm font-bold text-[#C4903E] whitespace-nowrap">
                      ${tour.price.toLocaleString("es-CO")}
                    </p>
                    <span className={`text-[0.55rem] tracking-widest uppercase font-sans px-2 py-0.5 hidden sm:inline ${tourStatusStyle[tour.status]}`}>
                      {tourStatusLabel[tour.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="border border-white/[0.06] p-4 sm:p-6">
        <p className="text-[0.68rem] tracking-[0.2em] uppercase text-white/35 font-sans mb-4">Acciones rápidas</p>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/tours/new" className="flex items-center gap-2 btn-primary" style={{ padding: "10px 20px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nuevo tour
          </a>
          <a href="/tours" target="_blank" className="flex items-center gap-2 btn-ghost" style={{ padding: "10px 20px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Ver sitio
          </a>
        </div>
      </div>
    </div>
  );
}