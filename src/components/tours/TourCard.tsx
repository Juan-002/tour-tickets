"use client";

import { useState } from "react";

import { ITour, TourStatus } from "@/types";

interface TourCardProps {
  tour: ITour;
}

const statusLabel: Record<TourStatus, { text: string; color: string }> = {
  ACTIVE:   { text: "Disponible", color: "#C4903E"               },
  SOLDOUT:  { text: "Agotado",    color: "#e05252"               },
  INACTIVE: { text: "Inactivo",   color: "rgba(245,237,216,0.3)" },
};

const DESC_LIMIT  = 120;
const TITLE_LIMIT = 25;
const LOCATION_LIMIT = 17;

export default function TourCard({ tour }: TourCardProps) {
  const [expanded, setExpanded] = useState(false);

  const status        = statusLabel[tour.status];
  const isSoldOut     = tour.status === TourStatus.SOLDOUT;

  // Título
  const isLongTitle    = tour.title.length > TITLE_LIMIT;
  const displayedTitle = isLongTitle && !expanded
    ? tour.title.slice(0, TITLE_LIMIT).trimEnd() + "..."
    : tour.title;

  // Descripción
  const isLong        = tour.description.length > DESC_LIMIT;
  const displayedDesc = isLong && !expanded
    ? tour.description.slice(0, DESC_LIMIT).trimEnd() + "..."
    : tour.description;

    const isLongLocation    = tour.location.length > LOCATION_LIMIT;
    const displayedLocation = isLongLocation && !expanded
      ? tour.location.slice(0, LOCATION_LIMIT).trimEnd() + "..."
      : tour.location;

  // Mostrar botón si cualquiera de los dos es largo
  const showToggle = isLongTitle || isLong || isLongLocation;

  return (
    <article
      className="tour-list-card"
      style={{ display: "flex", flexDirection: "column" }}
    >
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
        <span
          className="tour-list-card__badge"
          style={{ borderColor: status.color, color: status.color }}
        >
          {status.text}
        </span>
      </div>

      {/* Body */}
      <div
        className="tour-list-card__body"
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
      <p className="tour-list-card__meta">
        📍 {displayedLocation} &nbsp;·&nbsp; ⏱ {tour.duration}
      </p>

        {/* Título con truncado */}
        <h3 className="font-display tour-list-card__title">
          {displayedTitle}
        </h3>

        {/* Descripción expandible */}
        <div style={{ flex: 1 }}>
          <p
            className="font-body tour-list-card__desc"
            style={{
              margin: 0,
              ...(expanded && {
                display:         "block",
                WebkitLineClamp: "unset",
                overflow:        "visible",
              }),
            }}
          >
            {displayedDesc}
          </p>
          {showToggle && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background:          "none",
                border:              "none",
                padding:             "6px 0 0",
                cursor:              "pointer",
                color:               "#C4903E",
                fontSize:            "0.75rem",
                fontFamily:          "inherit",
                letterSpacing:       "0.05em",
                textDecoration:      "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {expanded ? "Ver menos ↑" : "Ver más ↓"}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="tour-list-card__footer" style={{ marginTop: "auto" }}>
          <div>
            <p className="tour-list-card__slots">
              {isSoldOut ? "Sin cupos disponibles" : `${tour.availableSlots} cupos disponibles`}
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
              padding:       "10px 20px",
              fontSize:      "0.78rem",
              pointerEvents: isSoldOut ? "none" : "auto",
              opacity:       isSoldOut ? 0.45 : 1,
            }}
          >
            {isSoldOut ? "Agotado" : "Comprar"}
          </a>
        </div>
      </div>
    </article>
  );
}