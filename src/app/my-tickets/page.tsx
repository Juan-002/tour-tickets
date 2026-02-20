//Historial del usuario
"use client";

import { useEffect, useState } from "react";

import { ITicket } from "@/types";
import { TicketStatus } from "@/types";

// Usuario mock hasta implementar autenticación
const MOCK_USER_ID = "user_mock_001";

const statusStyles: Record<TicketStatus, { label: string; color: string; bg: string; border: string }> = {
  CONFIRMED: { label: "Confirmado", color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/30"  },
  PENDING:   { label: "Pendiente",  color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  CANCELLED: { label: "Cancelado",  color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/30"    },
};

export default function MyTicketsPage() {
  const [tickets, setTickets]   = useState<ITicket[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res  = await fetch(`/api/tickets?userId=${MOCK_USER_ID}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Error al cargar tiquetes");
        setTickets(json.data ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const totalSpent = tickets
    .filter((t) => t.status === TicketStatus.CONFIRMED)
    .reduce((acc, t) => acc + t.totalPrice, 0);

  return (
    <main className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(196,144,62,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(34,87,45,0.25) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-275 mx-auto px-15 pb-24">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <header className="pt-16 pb-12">
            <p className=" text-9xl text-blue-900">Prueba que pasa</p>
          <p className="section-label mb-4 anim-fade-up">✦ Tu historial</p>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-black leading-none anim-fade-up-2">
              Mis <span className="italic text-[#C4903E]">tiquetes</span>
            </h1>
            {!loading && !error && (
              <p className="font-sans text-sm text-white/40 tracking-wide anim-fade-up-3">
                {tickets.length} {tickets.length === 1 ? "compra" : "compras"} realizadas
              </p>
            )}
          </div>
          <div className="w-12 h-0.5 bg-[#C4903E] mt-8" />
        </header>

        {/* ── STATS ───────────────────────────────────────────── */}
        {!loading && !error && tickets.length > 0 && (
          <div className="grid grid-cols-3 gap-5 mb-12 anim-fade-in">
            {[
              {
                label: "Total gastado",
                value: `$${totalSpent.toLocaleString("es-CO")}`,
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                ),
              },
              {
                label: "Tours visitados",
                value: new Set(tickets.filter(t => t.status === TicketStatus.CONFIRMED).map(t => t.tourId)).size,
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  </svg>
                ),
              },
              {
                label: "Personas totales",
                value: tickets.filter(t => t.status === TicketStatus.CONFIRMED).reduce((a, t) => a + t.quantity, 0),
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                ),
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/[0.03] border border-white/[0.07] p-6 flex items-center gap-5 hover:border-[#C4903E]/20 transition-colors duration-300"
              >
                <div className="w-11 h-11 border border-[#C4903E]/25 flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="font-sans text-xs text-white/40 tracking-widest uppercase mb-1">{s.label}</p>
                  <p className="font-serif text-2xl font-bold text-[#C4903E]">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LOADING ─────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-10 h-10 border border-[#C4903E]/30 border-t-[#C4903E] rounded-full animate-spin" />
            <p className="font-sans text-sm text-white/30 tracking-widest uppercase">Cargando tiquetes...</p>
          </div>
        )}

        {/* ── ERROR ───────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 text-red-400 font-sans text-sm p-5 mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── EMPTY ───────────────────────────────────────────── */}
        {!loading && !error && tickets.length === 0 && (
          <div className="flex flex-col items-center py-32 gap-5 text-center anim-fade-up">
            <div className="w-20 h-20 border border-[#C4903E]/20 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.4)" strokeWidth="1">
                <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
              </svg>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold mb-2">Aún no tienes tiquetes</p>
              <p className="font-sans text-sm text-white/35 leading-relaxed">
                Explora nuestros tours disponibles y reserva<br />tu primera experiencia.
              </p>
            </div>
            <a href="/tours" className="btn-primary mt-4" style={{ padding: "12px 32px" }}>
              Explorar tours
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        )}

        {/* ── TICKET LIST ─────────────────────────────────────── */}
        {!loading && !error && tickets.length > 0 && (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket, i) => {
              const st = statusStyles[ticket.status as TicketStatus] ?? statusStyles.PENDING;
              const tour = ticket.tour as { title?: string; location?: string; duration?: string; imageUrl?: string } | undefined;
              const date = new Date(ticket.createdAt).toLocaleDateString("es-CO", {
                year: "numeric", month: "long", day: "numeric",
              });

              return (
                <article
                  key={ticket.id}
                  className="flex gap-0 bg-[#162018]/90 border border-white/[0.07] overflow-hidden hover:border-[#C4903E]/25 transition-all duration-300 hover:-translate-y-0.5 anim-fade-up"
                  style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
                >
                  {/* Color accent left bar */}
                  <div
                    className="w-1 shrink-0"
                    style={{ background: ticket.status === "CONFIRMED" ? "#C4903E" : ticket.status === "CANCELLED" ? "#e05252" : "#eab308" }}
                  />

                  {/* Image thumbnail */}
                  <div className="w-28 shrink-0 relative overflow-hidden bg-linear-to-br from-[#1a3320] to-[#2d5a3d] hidden sm:block">
                    {tour?.imageUrl ? (
                      <img src={tour.imageUrl} alt={tour?.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.4)" strokeWidth="1">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 items-center gap-6 px-6 py-5">
                    {/* Tour info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[0.68rem] text-white/35 tracking-widest uppercase mb-1">
                        {date}
                      </p>
                      <h3 className="font-serif text-lg font-bold leading-tight mb-1 truncate">
                        {tour?.title ?? "Tour"}
                      </h3>
                      <p className="font-sans text-xs text-white/40">
                        {tour?.location && `📍 ${tour.location}`}
                        {tour?.duration && ` · ⏱ ${tour.duration}`}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="text-center shrink-0 hidden md:block">
                      <p className="font-sans text-[0.65rem] text-white/30 tracking-widest uppercase mb-1">Personas</p>
                      <p className="font-serif text-2xl font-bold text-[#F5EDD8]">{ticket.quantity}</p>
                    </div>

                    {/* Total */}
                    <div className="text-right shrink-0">
                      <p className="font-sans text-[0.65rem] text-white/30 tracking-widest uppercase mb-1">Total</p>
                      <p className="font-serif text-2xl font-bold text-amber-50">
                        ${ticket.totalPrice.toLocaleString("es-CO")}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                      <span className={`font-sans text-[0.68rem] font-medium tracking-widest uppercase px-3 py-1.5 border ${st.bg} ${st.border} ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}