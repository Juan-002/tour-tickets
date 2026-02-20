//Formulario de compra
import { tourService } from "@/services/tourService";
import { ITour } from "@/types";
import CheckoutForm from "@/components/checkout/CheckoutForm";

interface PageProps {
  searchParams: Promise<{ tourId?: string }>;
}

// Server Component: carga los tours disponibles y pasa el preseleccionado al form
export default async function CheckoutPage({ searchParams }: PageProps) {
  const { tourId } = await searchParams;
  const tours: ITour[] = await tourService.getAvailable();

  return (
    <main className="bg-mesh grain" style={{ minHeight: "100vh" }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{ padding: "64px 60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <p className="section-label anim-fade-up" style={{ marginBottom: 16 }}>
          ✦ Reserva tu experiencia
        </p>
        <h1 className="font-display anim-fade-up-2" style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          fontWeight: 900, lineHeight: 1.1,
        }}>
          Compra tu <span style={{ fontStyle: "italic", color: "#C4903E" }}>tiquete</span>
        </h1>
        <div className="divider" style={{ marginTop: 28 }} />
      </header>

      {/* ── FORM ────────────────────────────────────────────── */}
      <section style={{ padding: "0 60px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <CheckoutForm tours={tours} preselectedTourId={tourId} />
      </section>
    </main>
  );
}