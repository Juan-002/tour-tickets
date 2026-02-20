//Detalle del tour
import { notFound } from "next/navigation";

import { tourService } from "@/services/tourService";
import { TourStatus } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TourDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tour = await tourService.getById(id);

  if (!tour) notFound();

  const isSoldOut  = tour.status === TourStatus.SOLDOUT;
  const isInactive = tour.status === TourStatus.INACTIVE;
  const canBuy     = !isSoldOut && !isInactive;

  const occupancyPct = Math.round(
    ((tour.totalSlots - tour.availableSlots) / tour.totalSlots) * 100
  );

  return (
    <main className="bg-mesh grain" style={{ minHeight: "100vh" }}>

      {/* ── BREADCRUMB ──────────────────────────────────────── */}
      <div style={{ padding: "24px 60px 0", maxWidth: 1200, margin: "0 auto" }}>
        <p className="font-body" style={{ fontSize: "0.78rem", color: "rgba(245,237,216,0.35)", letterSpacing: "0.05em" }}>
          <a href="/tours" style={{ color: "rgba(245,237,216,0.35)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C4903E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,237,216,0.35)")}
          >
            Tours
          </a>
          {" / "}
          <span style={{ color: "rgba(245,237,216,0.6)" }}>{tour.title}</span>
        </p>
      </div>

      {/* ── HERO IMAGE ──────────────────────────────────────── */}
      <section style={{ padding: "32px 60px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div className="detail-hero-image">
          {tour.imageUrl ? (
            <img src={tour.imageUrl} alt={tour.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #1a3320 0%, #2d5a3d 50%, #1a3320 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.4)" strokeWidth="0.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          )}

          {/* Overlay gradient bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(to top, rgba(13,27,15,1), transparent)",
          }} />

          {/* Status badge */}
          <span className="tour-list-card__badge" style={{
            top: 20, right: 20,
            borderColor: isSoldOut ? "#e05252" : "#C4903E",
            color: isSoldOut ? "#e05252" : "#C4903E",
          }}>
            {isSoldOut ? "Agotado" : isInactive ? "Inactivo" : "Disponible"}
          </span>
        </div>
      </section>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <section style={{
        padding: "48px 60px 100px",
        maxWidth: 1200, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: 60,
        alignItems: "start",
      }}>

        {/* ── LEFT: Info ────────────────────────────────────── */}
        <div>
          <p className="section-label" style={{ marginBottom: 16 }}>
            📍 {tour.location}
          </p>

          <h1 className="font-display anim-fade-up" style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 900, lineHeight: 1.1, marginBottom: 24,
          }}>
            {tour.title}
          </h1>

          {/* Meta pills */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
            {[
              { icon: "⏱", label: tour.duration },
              { icon: "👥", label: `${tour.totalSlots} cupos totales` },
              { icon: "✅", label: `${tour.availableSlots} disponibles` },
            ].map((m) => (
              <span key={m.label} className="detail-pill">
                {m.icon} {m.label}
              </span>
            ))}
          </div>

          <div className="divider" style={{ marginBottom: 40 }} />

          {/* Description */}
          <h2 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 16 }}>
            Sobre este tour
          </h2>
          <p className="font-body" style={{
            fontSize: "1rem", lineHeight: 1.85,
            color: "rgba(245,237,216,0.65)", marginBottom: 48,
          }}>
            {tour.description}
          </p>

          {/* Occupancy bar */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p className="font-body" style={{ fontSize: "0.8rem", color: "rgba(245,237,216,0.45)", letterSpacing: "0.05em" }}>
                Ocupación del tour
              </p>
              <p className="font-body" style={{ fontSize: "0.8rem", color: "#C4903E" }}>
                {occupancyPct}%
              </p>
            </div>
            <div className="detail-progress-track">
              <div
                className="detail-progress-fill"
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
            <p className="font-body" style={{ fontSize: "0.75rem", color: "rgba(245,237,216,0.3)", marginTop: 8 }}>
              {tour.totalSlots - tour.availableSlots} personas ya reservaron
            </p>
          </div>
        </div>

        {/* ── RIGHT: Purchase card ───────────────────────────── */}
        <aside className="detail-purchase-card anim-fade-in">
          <p className="font-body" style={{ fontSize: "0.72rem", color: "rgba(245,237,216,0.4)", letterSpacing: "0.08em", marginBottom: 8 }}>
            PRECIO POR PERSONA
          </p>
          <p className="font-display" style={{ fontSize: "3rem", fontWeight: 900, color: "#C4903E", lineHeight: 1, marginBottom: 32 }}>
            ${tour.price.toLocaleString("es-CO")}
          </p>

          <div className="divider" style={{ marginBottom: 32 }} />

          {/* Tour summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
            {[
              { label: "Destino",   value: tour.location },
              { label: "Duración",  value: tour.duration },
              { label: "Cupos",     value: `${tour.availableSlots} de ${tour.totalSlots}` },
              { label: "Estado",    value: isSoldOut ? "Agotado" : "Disponible" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="font-body" style={{ fontSize: "0.8rem", color: "rgba(245,237,216,0.4)" }}>
                  {r.label}
                </span>
                <span className="font-body" style={{ fontSize: "0.85rem", color: "#F5EDD8" }}>
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          {canBuy ? (
            <a
              href={`/checkout?tourId=${tour.id}`}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "16px" }}
            >
              Comprar tiquetes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <div className="btn-ghost" style={{
              width: "100%", justifyContent: "center",
              padding: "16px", opacity: 0.45,
              cursor: "not-allowed", textAlign: "center",
            }}>
              {isSoldOut ? "Tour agotado" : "No disponible"}
            </div>
          )}

          <p className="font-body" style={{
            fontSize: "0.72rem", color: "rgba(245,237,216,0.25)",
            textAlign: "center", marginTop: 16, letterSpacing: "0.04em",
          }}>
            Los cupos se reservan al confirmar la compra
          </p>
        </aside>
      </section>
    </main>
  );
}