import { Suspense } from "react";

import { tourService } from "@/services/tourService";
import TourCard from "@/components/tours/TourCard";
import ToursFilter from "@/components/tours/ToursFilter";

interface PageProps {
  searchParams: Promise<{ q?: string; sort?: string }>;
}

export default async function ToursPage({ searchParams }: PageProps) {
  const { q = "", sort = "default" } = await searchParams;

  const allTours = await tourService.getAvailable();

  // ── Filtrar por búsqueda ──────────────────────────────────
  const search = q.toLowerCase().trim();
  let tours = search
    ? allTours.filter((t) =>
        t.title.toLowerCase().includes(search) ||
        t.location.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
      )
    : allTours;

  // ── Ordenar por precio ────────────────────────────────────
  if (sort === "price-asc")  tours = [...tours].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") tours = [...tours].sort((a, b) => b.price - a.price);

  return (
    <main className="bg-mesh grain" style={{ minHeight: "100vh" }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{ padding: "120px clamp(20px,5vw,60px) 48px", maxWidth: 1200, margin: "0 auto" }}>
        <p className="section-label anim-fade-up" style={{ marginBottom: 16 }}>
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
            {allTours.length} {allTours.length === 1 ? "tour encontrado" : "tours encontrados"}
          </p>
        </div>

        {/* Suspense requerido por useSearchParams en el cliente */}
        <Suspense fallback={null}>
          <ToursFilter total={allTours.length} filtered={tours.length} />
        </Suspense>

        <div className="divider" style={{ marginTop: 28 }} />
      </header>

      {/* ── GRID DE TOURS ───────────────────────────────────── */}
      <section style={{ padding: "0 clamp(20px,5vw,60px) 100px", maxWidth: 1200, margin: "0 auto" }}>
        {tours.length === 0 ? (
          <div className="tours-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.4)" strokeWidth="1">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="font-display" style={{ fontSize: "1.5rem", marginTop: 20 }}>
              {q ? `Sin resultados para "${q}"` : "No hay tours disponibles"}
            </p>
            <p className="font-body" style={{ color: "rgba(245,237,216,0.4)", marginTop: 8 }}>
              {q
                ? "Intenta con otro nombre o ubicación."
                : "Vuelve pronto, estamos preparando nuevas experiencias."}
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