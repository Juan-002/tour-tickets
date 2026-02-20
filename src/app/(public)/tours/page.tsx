// src/app/(public)/tours/page.tsx
import { tourService } from "@/services/tourService";
import TourCard from "@/components/tours/TourCard";

// Server Component: fetch directo al servicio sin pasar por la API HTTP
export default async function ToursPage() {
  const tours = await tourService.getAvailable();

  return (
    <main className="bg-mesh grain " style={{ minHeight: "100vh" }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{ padding: "120px 60px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <p className="section-label anim-fade-up " style={{ marginBottom: 16 }}>
          ✦ Experiencias disponibles
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <h1 className="font-display anim-fade-up-2" style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 900, lineHeight: 1.1,
          }}>
            Tours <span style={{ fontStyle: "italic", color: "#C4903E" }}>disponibles</span>
          </h1>
          <p className="font-body anim-fade-up-3" style={{
            fontSize: "0.9rem",
            color: "rgba(245,237,216,0.45)",
            letterSpacing: "0.05em",
          }}>
            {tours.length} {tours.length === 1 ? "tour encontrado" : "tours encontrados"}
          </p>
        </div>

        {/* Divider */}
        <div className="divider" style={{ marginTop: 32 }} />
      </header>

      {/* ── GRID DE TOURS ───────────────────────────────────── */}
      <section style={{ padding: "0 60px 100px", maxWidth: 1200, margin: "0 auto" }}>
        {tours.length === 0 ? (
          <div className="tours-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.4)" strokeWidth="1">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="font-display" style={{ fontSize: "1.5rem", marginTop: 20 }}>
              No hay tours disponibles
            </p>
            <p className="font-body" style={{ color: "rgba(245,237,216,0.4)", marginTop: 8 }}>
              Vuelve pronto, estamos preparando nuevas experiencias.
            </p>
          </div>
        ) : (
          <div className="tours-grid">
            {tours.map((tour, i) => (
              <div
                key={tour.id}
                className="anim-fade-up"
                style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
              >
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}