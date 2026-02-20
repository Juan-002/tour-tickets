import { notFound } from "next/navigation";

import { tourService } from "@/services/tourService";
import { TourStatus } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

function FeatureItem({ icon, label, available }: { icon: string; label: string; available: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 20px",
      background: available ? "rgba(196,144,62,0.06)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${available ? "rgba(196,144,62,0.2)" : "rgba(255,255,255,0.06)"}`,
    }}>
      <span style={{ fontSize: "1.2rem" }}>{icon}</span>
      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", color: available ? "rgba(245,237,216,0.85)" : "rgba(245,237,216,0.3)" }}>
        {label}
      </span>
      <span style={{
        marginLeft: "auto", fontSize: "0.7rem",
        fontFamily: "DM Sans, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" as const,
        color: available ? "#C4903E" : "rgba(245,237,216,0.2)",
      }}>
        {available ? "Sí" : "No"}
      </span>
    </div>
  );
}

export default async function TourDetailPage({ params }: PageProps) {
  const { id } = await params;

  const tour = await tourService.getById(id);
  if (!tour) notFound();

  const isSoldOut = tour.status === TourStatus.SOLDOUT;
  const nights    = tour.nights ?? 0;
  const days      = nights + 1;

  return (
    <main
      className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(196,144,62,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(34,87,45,0.20) 0%, transparent 60%)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 60px 100px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40, marginTop: 30 }}>
          <a href="/tours" style={{ color: "rgba(245,237,216,0.3)", textDecoration: "none", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Tours
          </a>
          <span style={{ color: "rgba(245,237,216,0.2)" }}>/</span>
          <span style={{ color: "rgba(245,237,216,0.6)", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem" }}>
            {tour.title}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 60, alignItems: "start" }}>

          {/* ── LEFT ──────────────────────────────────────────── */}
          <div>

            {/* Hero image */}
            <div style={{ position: "relative", height: 420, overflow: "hidden", marginBottom: 36 }}>
              {tour.imageUrl ? (
                <img src={tour.imageUrl} alt={tour.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a3320, #2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.3)" strokeWidth="1">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  </svg>
                </div>
              )}
              <span style={{
                position: "absolute", top: 20, right: 20,
                border: `1px solid ${isSoldOut ? "#e05252" : "#C4903E"}`,
                color: isSoldOut ? "#e05252" : "#C4903E",
                background: "rgba(13,27,15,0.85)", backdropFilter: "blur(4px)",
                padding: "6px 14px", fontFamily: "DM Sans, sans-serif",
                fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
              }}>
                {isSoldOut ? "Agotado" : "Disponible"}
              </span>
            </div>

            {/* Meta */}
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "rgba(245,237,216,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              📍 {tour.location} &nbsp;·&nbsp; ⏱ {tour.duration}
            </p>

            {/* Title */}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 32 }}>
              {tour.title}
            </h1>

            {/* Días / noches */}
            <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
              {[
                { label: "Días",   value: days   },
                { label: "Noches", value: nights },
              ].map((d) => (
                <div key={d.label} style={{ textAlign: "center", padding: "16px 28px", background: "rgba(196,144,62,0.06)", border: "1px solid rgba(196,144,62,0.15)" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#C4903E", margin: 0 }}>{d.value}</p>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,237,216,0.4)", margin: 0 }}>{d.label}</p>
                </div>
              ))}
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4903E", marginBottom: 16 }}>
                ✦ Descripción
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem", color: "rgba(245,237,216,0.65)", lineHeight: 1.8, margin: 0 }}>
                {tour.description}
              </p>
            </div>

            {/* Características */}
            <div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4903E", marginBottom: 16 }}>
                ✦ Incluye y permite
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <FeatureItem icon="🐾" label="Mascotas permitidas"  available={tour.petsAllowed}  />
                <FeatureItem icon="👶" label="Apto para niños"      available={tour.kidsAllowed}  />
                <FeatureItem icon="🚌" label="Transporte incluido"  available={tour.hasTransport} />
                <FeatureItem
                  icon="🏨"
                  label={tour.lodgingType ? `Alojamiento — ${tour.lodgingType}` : "Alojamiento incluido"}
                  available={tour.hasLodging}
                />
              </div>
              <div>
                  <p className="text-3xl text-orange-400 ">Incluye</p>
                  <p> . Tiquetes aéreos con Avianca (ida y regreso).
                      Equipaje de bodega de 23kg y de mano de 8 kg.
                      Guía profesional de turismo.
                      Seguro de viaje.</p> <br />
                  <p className="text-3xl text-orange-400 ">
                    Alojamientos y alimentación
                  </p>
                  <p> . Incluido en los dias que dura el tour</p>

              </div>
            </div>
          </div>

          {/* ── RIGHT: Sticky booking ─────────────────────────── */}
          <aside style={{ position: "sticky", top: 100, background: "rgba(22,32,24,0.95)", border: "1px solid rgba(196,144,62,0.2)", padding: 32 }}>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,237,216,0.3)", marginBottom: 6 }}>
              Precio por persona
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 900, color: "#C4903E", margin: 0 }}>
              ${tour.price.toLocaleString("es-CO")}
            </p>

            <div style={{ width: 40, height: 2, background: "#C4903E", margin: "20px 0" }} />

            {[
              { label: "Duración",  value: tour.duration },
              { label: "Cupos",     value: `${tour.availableSlots} de ${tour.totalSlots}` },
              { label: "Ubicación", value: tour.location },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", color: "rgba(245,237,216,0.35)" }}>{r.label}</span>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", textAlign: "right", maxWidth: 160 }}>{r.value}</span>
              </div>
            ))}

            <div style={{ marginTop: 24 }}>
              {isSoldOut ? (
                <div style={{ textAlign: "center", padding: 14, border: "1px solid rgba(224,82,82,0.3)", color: "#e05252", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Sin cupos disponibles
                </div>
              ) : (
                <a
                  href={`/checkout?tourId=${tour.id}`}
                  className="btn-primary"
                  style={{ display: "block", textAlign: "center", padding: 14, boxSizing: "border-box" as const }}
                >
                  Comprar tiquete
                </a>
              )}
            </div>

            <a href="/tours" style={{ display: "block", textAlign: "center", marginTop: 12, fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "rgba(245,237,216,0.25)", textDecoration: "none", letterSpacing: "0.1em" }}>
              ← Ver todos los tours
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}