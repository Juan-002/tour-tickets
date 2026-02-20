import { ITour } from "@/types";
import { LinkButton } from "@/components/ui/Button";

import TourCard from "./TourCard";

interface TourListProps {
  tours: ITour[];
}

export default function TourList({ tours }: TourListProps) {
  if (tours.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-32 text-center">
        <div className="w-20 h-20 border border-[#C4903E]/20 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.4)" strokeWidth="1">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <div>
          <p className="font-serif text-2xl font-bold mb-2 text-[#F5EDD8]">
            No hay tours disponibles
          </p>
          <p className="font-sans text-sm leading-relaxed text-white/35">
            Vuelve pronto, estamos preparando nuevas experiencias.
          </p>
        </div>
        <LinkButton href="/admin/tours/new" variant="ghost" size="md" className="mt-2">
          Crear tour
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
      {tours.map((tour, i) => (
        <div
          key={tour.id}
          style={{
            animationName: "fadeUp",
            animationDuration: "0.6s",
            animationDelay: `${i * 0.07}s`,
            animationFillMode: "forwards",
            animationTimingFunction: "ease",
            opacity: 0,
          }}
        >
          <TourCard tour={tour} />
        </div>
      ))}
    </div>
  );
}