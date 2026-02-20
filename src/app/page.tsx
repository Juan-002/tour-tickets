// src/app/(public)/page.tsx
import { getSession } from "@/lib/auth";
import HomeNav from "@/components/layout/HomeNav";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8] overflow-x-hidden font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <HomeNav session={session} />

      <div className="grain bg-mesh">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section style={{
          minHeight: "100vh",
          display: "flex", alignItems: "center",
          padding: "clamp(100px, 15vw, 140px) clamp(20px, 5vw, 60px) 80px",
          position: "relative", overflow: "hidden",
          flexDirection: "column",
        }}>

          {/* Decorative circles — ocultos en móvil */}
          <div className="hidden md:block" style={{
            position: "absolute", right: "-10%", top: "10%",
            width: 700, height: 700, borderRadius: "50%",
            border: "1px solid rgba(196,144,62,0.08)", pointerEvents: "none",
          }} />
          <div className="hidden md:block" style={{
            position: "absolute", right: "-5%", top: "15%",
            width: 500, height: 500, borderRadius: "50%",
            border: "1px solid rgba(196,144,62,0.12)", pointerEvents: "none",
          }} />

          {/* Layout: texto + card */}
          <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>

            {/* Left content */}
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <p className="section-label anim-fade-up" style={{ marginBottom: 24 }}>
                ✦ Descubre el mundo
              </p>

              <h1 className="font-display anim-fade-up-2" style={{
                fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
                lineHeight: 1.0, fontWeight: 900, marginBottom: 24,
              }}>
                Aventuras<br />
                <span style={{ fontStyle: "italic", color: "#C4903E" }}>sin límites</span>
              </h1>

              <p className="font-body anim-fade-up-3" style={{
                fontSize: "clamp(0.95rem, 2vw, 1.125rem)", lineHeight: 1.75,
                color: "rgba(245,237,216,0.65)", maxWidth: 480, marginBottom: 36,
              }}>
                Reserva tus tiquetes para los tours más increíbles.
                Experiencias únicas, cupos limitados, recuerdos para toda la vida.
              </p>

              <div className="anim-fade-up-4" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <a href="/tours" className="btn-primary">
                  Explorar tours
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="/my-tickets" className="btn-ghost">Mis compras</a>
              </div>

              {/* Stats */}
              <div className="anim-fade-in" style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(16px, 3vw, 32px)", marginTop: "clamp(40px, 6vw, 80px)", maxWidth: 480,
              }}>
                {[
                  { value: "120+", label: "Tours activos"    },
                  { value: "4.9★", label: "Valoración media" },
                  { value: "8K+",  label: "Viajeros felices" },
                ].map((s) => (
                  <div className="stat-card" key={s.label}>
                    <p className="font-display" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#C4903E" }}>
                      {s.value}
                    </p>
                    <p className="font-body" style={{ fontSize: "0.75rem", color: "rgba(245,237,216,0.5)", marginTop: 4, letterSpacing: "0.05em" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating tour card — solo desktop */}
            <div className="hidden lg:block anim-fade-in" style={{ position: "relative", flexShrink: 0 }}>
              <div className="tour-card float-card">
                <div style={{
                  height: 180,
                  background: "linear-gradient(135deg, #1a3320 0%, #2d5a3d 50%, #1a3320 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 40%, rgba(196,144,62,0.2), transparent 60%)" }} />
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.6)" strokeWidth="1">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <div style={{ position: "absolute", top: 12, right: 12, background: "#C4903E", color: "#0D1B0F", fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif" }}>
                    NUEVO
                  </div>
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#C4903E", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
                    COLOMBIA · 3 DÍAS
                  </p>
                  <p className="font-display" style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
                    Tour Ciudad Perdida
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "0.7rem", color: "rgba(245,237,216,0.4)", fontFamily: "'DM Sans', sans-serif" }}>desde</p>
                      <p className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#C4903E" }}>$1'500.000</p>
                    </div>
                    <a href="/tours" style={{ background: "rgba(196,144,62,0.15)", border: "1px solid rgba(196,144,62,0.3)", color: "#C4903E", padding: "8px 16px", fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textDecoration: "none", display: "inline-block" }}>
                      Ver →
                    </a>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", top: 16, left: -20, width: 280, height: 280, background: "#162018", border: "1px solid rgba(196,144,62,0.12)", transform: "rotate(-3deg)", zIndex: -1 }} />
            </div>
          </div>

          {/* Scroll indicator — oculto en móvil */}
          <div className="hidden sm:flex" style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", color: "rgba(245,237,216,0.35)", fontFamily: "'DM Sans', sans-serif" }}>SCROLL</p>
            <div className="scroll-line" />
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────── */}
        <section style={{ padding: "clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 72px)" }}>
            <p className="section-label" style={{ marginBottom: 16 }}>¿Por qué elegirnos?</p>
            <h2 className="font-display" style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", fontWeight: 700, lineHeight: 1.2 }}>
              Una experiencia diseñada<br />
              <span style={{ fontStyle: "italic", color: "#C4903E" }}>para el viajero</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
                title: "Reserva en minutos",
                desc: "Proceso de compra simple y rápido. Selecciona tu tour, elige cuántas personas y listo.",
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: "Cupos garantizados",
                desc: "Sistema de cupos en tiempo real. Tu reserva asegura tu lugar instantáneamente.",
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
                title: "Historial completo",
                desc: "Accede a todas tus compras, fechas y detalles desde tu panel personal.",
              },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div style={{ width: 56, height: 56, border: "1px solid rgba(196,144,62,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  {f.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                <p className="font-body" style={{ fontSize: "0.9rem", color: "rgba(245,237,216,0.55)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ────────────────────────────────────────── */}
        <section style={{ padding: "0 clamp(20px, 5vw, 60px) clamp(60px, 10vw, 120px)" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(196,144,62,0.15) 0%, rgba(34,87,45,0.15) 100%)",
            border: "1px solid rgba(196,144,62,0.2)",
            padding: "clamp(36px, 6vw, 72px) clamp(24px, 5vw, 80px)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 32, flexWrap: "wrap",
          }}>
            <div>
              <p className="section-label" style={{ marginBottom: 16 }}>Empieza hoy</p>
              <h2 className="font-display" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)", fontWeight: 700, lineHeight: 1.2 }}>
                Tu próxima aventura<br />
                <span style={{ fontStyle: "italic", color: "#C4903E" }}>te está esperando</span>
              </h2>
            </div>
            <a href="/tours" className="btn-primary" style={{ flexShrink: 0 }}>
              Ver todos los tours
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}