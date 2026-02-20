import { tourService } from "@/services/tourService";
import DeleteTourButton from "@/components/ui/Deletetourbutton";

const statusStyle: Record<string, string> = {
  ACTIVE:   "bg-green-400/10 text-green-400 border border-green-400/25",
  SOLDOUT:  "bg-red-400/10 text-red-400 border border-red-400/25",
  INACTIVE: "bg-white/5 text-white/30 border border-white/10",
};
const statusLabel: Record<string, string> = {
  ACTIVE:   "Activo",
  SOLDOUT:  "Agotado",
  INACTIVE: "Inactivo",
};

export default async function AdminToursPage() {
  const tours = await tourService.getAll();

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.68rem] tracking-[0.25em] uppercase text-[#C4903E] font-sans mb-2">
            ✦ Gestión
          </p>
          <h2 className="font-serif text-4xl font-black text-[#F5EDD8]">
            Tours <span className="italic text-[#C4903E]">disponibles</span>
          </h2>
          <p className="mt-1 font-sans text-sm text-white/35">
            {tours.length} {tours.length === 1 ? "tour registrado" : "tours registrados"}
          </p>
        </div>
        <a
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans font-medium text-sm tracking-widest uppercase px-6 py-3 hover:bg-[#D4A24E] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo tour
        </a>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.07] overflow-hidden">
        {tours.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.3)" strokeWidth="1">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            <p className="font-serif text-xl font-bold text-white/50">No hay tours creados</p>
            <a
              href="/admin/tours/new"
              className="inline-flex items-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans text-sm tracking-widest uppercase px-6 py-3 mt-2 hover:bg-[#D4A24E] transition-colors"
            >
              Crear primer tour
            </a>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Tour", "Ubicación", "Duración", "Precio", "Cupos", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[0.65rem] tracking-[0.18em] uppercase text-white/30 font-sans font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#1a3320] to-[#2d5a3d] overflow-hidden">
                        {tour.imageUrl && <img src={tour.imageUrl} alt={tour.title} className="object-cover w-full h-full" />}
                      </div>
                      <p className="font-sans text-sm text-white/85 font-medium max-w-[180px] truncate">{tour.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-sans text-sm text-white/50">{tour.location}</td>
                  <td className="px-5 py-4 font-sans text-sm text-white/50">{tour.duration}</td>
                  <td className="px-5 py-4 font-serif text-sm font-bold text-[#C4903E]">
                    ${tour.price.toLocaleString("es-CO")}
                  </td>
                  <td className="px-5 py-4">
                    <p className="mb-1 font-sans text-xs text-white/50">{tour.availableSlots} / {tour.totalSlots}</p>
                    <div className="w-20 h-1 overflow-hidden bg-white/10">
                      <div className="h-full bg-[#C4903E]" style={{ width: `${Math.round((tour.availableSlots / tour.totalSlots) * 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[0.6rem] tracking-widest uppercase font-sans px-2.5 py-1 ${statusStyle[tour.status]}`}>
                      {statusLabel[tour.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/tours/${tour.id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-white/50 border border-white/10 hover:border-[#C4903E]/40 hover:text-[#C4903E] transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editar
                      </a>
                      <DeleteTourButton tourId={tour.id} tourTitle={tour.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}