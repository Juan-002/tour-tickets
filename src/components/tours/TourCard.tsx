import { ITour } from "@/types";
import { TourStatus } from "@/types";

interface TourCardProps {
  tour: ITour;
}

const statusLabel: Record<TourStatus, { text: string; color: string }> = {
  ACTIVE:   { text: "Disponible",  color: "#C4903E" },
  SOLDOUT:  { text: "Agotado",     color: "#e05252" },
  INACTIVE: { text: "Inactivo",    color: "rgba(245,237,216,0.3)" },
};

export default function TourCard({ tour }: TourCardProps) {
  const status = statusLabel[tour.status];
  const isSoldOut = tour.status === TourStatus.SOLDOUT;

  return (
    <article className="tour-list-card">
      {/* Image */}
      <div className="tour-list-card__image">
        {tour.imageUrl ? (
          <img
            src={tour.imageUrl}
            alt={tour.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="tour-list-card__image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(196,144,62,0.5)" strokeWidth="1">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}

        {/* Status badge */}
        <span
          className="tour-list-card__badge"
          style={{ borderColor: status.color, color: status.color }}
        >
          {status.text}
        </span>
      </div>

      {/* Content */}
      <div className="tour-list-card__body">
        <p className="tour-list-card__meta">
          📍 {tour.location} &nbsp;·&nbsp; ⏱ {tour.duration}
        </p>

        <h3 className="font-display tour-list-card__title">{tour.title}</h3>

        <p className="font-body tour-list-card__desc">{tour.description}</p>

        <div className="tour-list-card__footer">
          <div>
            <p className="tour-list-card__slots">
              {isSoldOut
                ? "Sin cupos disponibles"
                : `${tour.availableSlots} cupos disponibles`}
            </p>
            <p className="font-display tour-list-card__price">
              ${tour.price.toLocaleString("es-CO")}
              <span className="tour-list-card__per"> / persona</span>
            </p>
          </div>

          <a
            href={isSoldOut ? "#" : `/checkout?tourId=${tour.id}`}
            className={isSoldOut ? "btn-ghost" : "btn-primary"}
            style={{
              padding: "10px 20px",
              fontSize: "0.78rem",
              pointerEvents: isSoldOut ? "none" : "auto",
              opacity: isSoldOut ? 0.45 : 1,
            }}
          >
            {isSoldOut ? "Agotado" : "Comprar"}
          </a>
        </div>
      </div>
    </article>
  );
}