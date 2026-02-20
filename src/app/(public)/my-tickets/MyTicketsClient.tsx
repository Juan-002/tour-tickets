"use client";

import { useEffect, useState } from "react";

import { TicketStatus } from "@/types";

interface MyTicketsClientProps {
  userId:   string;
  userName: string;
}

const statusStyles: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: "Confirmado", cls: "bg-amber-400/10 text-amber-400 border border-amber-400/25"   },
  PENDING:   { label: "Pendiente",  cls: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/25" },
  CANCELLED: { label: "Cancelado",  cls: "bg-red-400/10 text-red-400 border border-red-400/25"          },
};

export default function MyTicketsClient({ userId, userName }: MyTicketsClientProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res  = await fetch(`/api/tickets?userId=${userId}`);
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
  }, [userId]);

  const totalSpent = tickets
    .filter((t) => t.status === TicketStatus.CONFIRMED)
    .reduce((acc: number, t: any) => acc + t.totalPrice, 0);

  return (
    <main
      className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(196,144,62,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(34,87,45,0.25) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-[60px] pb-24">

        {/* Header */}
        <header className="pt-16 pb-8 sm:pb-12">
          <p className="pt-[30px] text-[0.68rem] tracking-[0.25em] uppercase text-[#C4903E] font-sans mb-4">✦ Tu historial</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] font-black leading-none">
              Mis <span className="italic text-[#C4903E]">tiquetes</span>
            </h1>
            {!loading && !error && (
              <p className="font-sans text-sm text-white/40">
                {tickets.length} {tickets.length === 1 ? "compra" : "compras"} realizadas
              </p>
            )}
          </div>
          <div className="w-12 h-0.5 bg-[#C4903E] mt-6 sm:mt-8" />
        </header>

        {/* Stats — 1 col móvil, 3 cols desktop */}
        {!loading && !error && tickets.length > 0 && (
          <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-3 sm:gap-5 sm:mb-12">
            {[
              {
                label: "Total gastado",
                value: `$${totalSpent.toLocaleString("es-CO")}`,
                icon:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
              },
              {
                label: "Tours visitados",
                value: new Set(tickets.filter((t: any) => t.status === "CONFIRMED").map((t: any) => t.tourId)).size,
                icon:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>,
              },
              {
                label: "Personas totales",
                value: tickets.filter((t: any) => t.status === "CONFIRMED").reduce((a: number, t: any) => a + t.quantity, 0),
                icon:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
              },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] p-5 flex items-center gap-4 hover:border-[#C4903E]/20 transition-colors">
                <div className="w-10 h-10 sm:w-11 sm:h-11 border border-[#C4903E]/25 flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="mb-1 font-sans text-xs tracking-widest uppercase text-white/40">{s.label}</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#C4903E]">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-6 py-32">
            <div className="w-10 h-10 border border-[#C4903E]/30 border-t-[#C4903E] rounded-full animate-spin" />
            <p className="font-sans text-sm tracking-widest uppercase text-white/30">Cargando tiquetes...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-5 mb-8 font-sans text-sm text-red-400 border bg-red-500/10 border-red-500/20">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && tickets.length === 0 && (
          <div className="flex flex-col items-center gap-5 px-4 py-24 text-center">
            <div className="w-20 h-20 border border-[#C4903E]/20 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.4)" strokeWidth="1">
                <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
              </svg>
            </div>
            <div>
              <p className="mb-2 font-serif text-2xl font-bold">Aún no tienes tiquetes</p>
              <p className="font-sans text-sm text-white/35">Explora nuestros tours y reserva tu primera experiencia.</p>
            </div>
            <a href="/tours" className="inline-flex items-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans text-sm tracking-widest uppercase px-6 py-3 mt-4 hover:bg-[#D4A24E] transition-colors">
              Explorar tours
            </a>
          </div>
        )}

        {/* Ticket list */}
        {!loading && !error && tickets.length > 0 && (
          <div className="flex flex-col gap-3 sm:gap-4">
            {tickets.map((ticket: any) => {
              const st   = statusStyles[ticket.status] ?? statusStyles.PENDING;
              const tour = ticket.tour as { title?: string; location?: string; duration?: string } | undefined;
              const date = new Date(ticket.createdAt).toLocaleDateString("es-CO", {
                year: "numeric", month: "long", day: "numeric",
              });
              const accentColor =
                ticket.status === "CONFIRMED" ? "#C4903E"
                : ticket.status === "CANCELLED" ? "#e05252"
                : "#eab308";

              return (
                <article
                  key={ticket.id}
                  className="flex bg-[#162018]/90 border border-white/[0.07] overflow-hidden hover:border-[#C4903E]/25 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Barra de color */}
                  <div className="w-1 shrink-0" style={{ background: accentColor }} />

                  <div className="flex-1 min-w-0 px-4 py-4 sm:px-6 sm:py-5">

                    {/* ── MÓVIL: layout vertical ─────────────── */}
                    <div className="flex flex-col gap-3 sm:hidden">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-sans text-[0.65rem] text-white/35 tracking-widest uppercase mb-1">{date}</p>
                          <h3 className="font-serif text-base font-bold leading-tight">{tour?.title ?? "Tour"}</h3>
                        </div>
                        <span className={`shrink-0 font-sans text-[0.6rem] font-medium tracking-widest uppercase px-2.5 py-1 border ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                      {(tour?.location || tour?.duration) && (
                        <p className="font-sans text-xs text-white/40">
                          {tour?.location && `📍 ${tour.location}`}
                          {tour?.duration && ` · ⏱ ${tour.duration}`}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                        <div>
                          <p className="font-sans text-[0.6rem] text-white/30 tracking-widest uppercase mb-0.5">Personas</p>
                          <p className="font-serif text-lg font-bold">{ticket.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans text-[0.6rem] text-white/30 tracking-widest uppercase mb-0.5">Total</p>
                          <p className="font-serif text-xl font-bold text-[#C4903E]">${ticket.totalPrice.toLocaleString("es-CO")}</p>
                        </div>
                      </div>
                    </div>

                    {/* ── DESKTOP: layout horizontal ─────────── */}
                    <div className="items-center hidden gap-6 sm:flex">
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[0.68rem] text-white/35 tracking-widest uppercase mb-1">{date}</p>
                        <h3 className="mb-1 font-serif text-lg font-bold leading-tight truncate">{tour?.title ?? "Tour"}</h3>
                        <p className="font-sans text-xs text-white/40">
                          {tour?.location && `📍 ${tour.location}`}
                          {tour?.duration && ` · ⏱ ${tour.duration}`}
                        </p>
                      </div>
                      <div className="text-center shrink-0">
                        <p className="font-sans text-[0.65rem] text-white/30 tracking-widest uppercase mb-1">Personas</p>
                        <p className="font-serif text-2xl font-bold">{ticket.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-sans text-[0.65rem] text-white/30 tracking-widest uppercase mb-1">Total</p>
                        <p className="font-serif text-2xl font-bold text-[#C4903E]">${ticket.totalPrice.toLocaleString("es-CO")}</p>
                      </div>
                      <span className={`shrink-0 font-sans text-[0.68rem] font-medium tracking-widest uppercase px-3 py-1.5 border ${st.cls}`}>
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