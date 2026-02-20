// src/app/checkout/page.tsx
import { redirect } from "next/navigation";

import { tourService } from "@/services/tourService";
import { getSession } from "@/lib/auth";
import { ITour } from "@/types";
import CheckoutForm from "@/components/checkout/CheckoutForm";

interface PageProps {
  searchParams: Promise<{ tourId?: string }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { tourId } = await searchParams;
  const tours: ITour[] = await tourService.getAvailable();

  return (
    <main
      className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(196,144,62,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(34,87,45,0.25) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-[60px] pb-24">
        <header className="pt-16 pb-12">
          <p className="pt-[30px] text-[0.68rem] tracking-[0.25em] uppercase text-[#C4903E] font-sans mb-4">
            ✦ Reserva tu experiencia
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-black leading-none">
            Compra tu <span className="italic text-[#C4903E]">tiquete</span>
          </h1>
          <div className="w-12 h-0.5 bg-[#C4903E] mt-8" />
        </header>

        <CheckoutForm tours={tours} preselectedTourId={tourId} userId={session.id} />
      </div>


    </main>
  );
}