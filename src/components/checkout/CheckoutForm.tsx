"use client";

import { useState, useEffect, useTransition } from "react";

import { ITour } from "@/types";

interface CheckoutFormProps {
  tours: ITour[];
  preselectedTourId?: string;
   userId:             string;
}

type Step = "form" | "confirm" | "success";

// Usuario mock hasta implementar autenticación
const MOCK_USER_ID = "user_mock_001";

export default function CheckoutForm({ tours, preselectedTourId, userId }: CheckoutFormProps) {
  const [step, setStep]           = useState<Step>("form");
  const [selectedTourId, setSelectedTourId] = useState(preselectedTourId ?? "");
  const [quantity, setQuantity]   = useState(1);
  const [error, setError]         = useState<string | null>(null);
  const [ticketId, setTicketId]   = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedTour = tours.find((t) => t.id === selectedTourId) ?? null;
  const totalPrice   = selectedTour ? selectedTour.price * quantity : 0;
  const maxQuantity  = Math.min(selectedTour?.availableSlots ?? 1, 20);

  // Si cambia el tour, resetea cantidad
  useEffect(() => {
    setQuantity(1);
    setError(null);
  }, [selectedTourId]);

  // ── Paso 1: validar y pasar a confirmación ─────────────────
  function handleReview() {
    if (!selectedTourId) return setError("Selecciona un tour para continuar.");
    if (quantity < 1)    return setError("La cantidad mínima es 1 persona.");
    setError(null);
    setStep("confirm");
  }

  // ── Paso 2: confirmar y enviar a la API ────────────────────
  function handleConfirm() {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            tourId: selectedTourId, 
            userId, quantity 
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json.error ?? "Error al procesar la compra.");
          setStep("form");
          return;
        }

        setTicketId(json.data?.id ?? null);
        setStep("success");
      } catch {
        setError("Error de conexión. Intenta de nuevo.");
        setStep("form");
      }
    });
  }

  // ── Resetear formulario ────────────────────────────────────
  function handleReset() {
    setStep("form");
    setSelectedTourId(preselectedTourId ?? "");
    setQuantity(1);
    setError(null);
    setTicketId(null);
  }

  // ────────────────────────────────────────────────────────────
  // RENDER: SUCCESS
  // ────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="checkout-success anim-fade-up">
        <div className="checkout-success__icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2 className="font-display" style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: 12 }}>
          ¡Reserva confirmada!
        </h2>
        <p className="font-body" style={{ color: "rgba(245,237,216,0.55)", fontSize: "1rem", marginBottom: 8 }}>
          Tu tiquete ha sido creado exitosamente.
        </p>
        {ticketId && (
          <p className="font-body" style={{ fontSize: "0.78rem", color: "rgba(245,237,216,0.3)", letterSpacing: "0.08em", marginBottom: 40 }}>
            ID: {ticketId}
          </p>
        )}

        {/* Summary */}
        <div className="checkout-success__summary">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="font-body" style={{ color: "rgba(245,237,216,0.45)", fontSize: "0.85rem" }}>Tour</span>
            <span className="font-body" style={{ fontSize: "0.9rem" }}>{selectedTour?.title}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="font-body" style={{ color: "rgba(245,237,216,0.45)", fontSize: "0.85rem" }}>Personas</span>
            <span className="font-body" style={{ fontSize: "0.9rem" }}>{quantity}</span>
          </div>
          <div className="divider" style={{ margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-body" style={{ color: "rgba(245,237,216,0.45)", fontSize: "0.85rem" }}>Total pagado</span>
            <span className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "#C4903E" }}>
              ${totalPrice.toLocaleString("es-CO")}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
          <a href="/my-tickets" className="btn-primary">
            Ver mis tiquetes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <button onClick={handleReset} className="btn-ghost" style={{ border: "none", cursor: "pointer" }}>
            Nueva compra
          </button>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // RENDER: FORM + CONFIRM
  // ────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gap: 48,
      alignItems: "start",
    }}>

      {/* ── LEFT: Form ──────────────────────────────────────── */}
      <div>

        {/* Step indicator */}
        <div className="checkout-steps">
          {(["form", "confirm"] as Step[]).map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="checkout-step-dot" style={{
                background: step === s || (s === "form" && step === "confirm") ? "#C4903E" : "rgba(245,237,216,0.1)",
                border: `1px solid ${step === s ? "#C4903E" : "rgba(245,237,216,0.15)"}`,
              }}>
                {(step === "confirm" && s === "form") ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D1B0F" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ fontSize: "0.65rem", color: step === s ? "#0D1B0F" : "rgba(245,237,216,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span className="font-body" style={{
                fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase",
                color: step === s ? "#F5EDD8" : "rgba(245,237,216,0.3)",
              }}>
                {s === "form" ? "Selección" : "Confirmación"}
              </span>
              {i === 0 && (
                <div style={{ width: 40, height: 1, background: "rgba(245,237,216,0.1)", margin: "0 4px" }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Error ─────────────────────────────────────────── */}
        {error && (
          <div className="checkout-error anim-fade-up">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {step === "form" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

            {/* Tour selector */}
            <div className="checkout-field">
              <label className="checkout-label">
                Selecciona el tour
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tours.length === 0 ? (
                  <p className="font-body" style={{ color: "rgba(245,237,216,0.35)", fontSize: "0.9rem" }}>
                    No hay tours disponibles en este momento.
                  </p>
                ) : (
                  tours.map((tour) => (
                    <label
                      key={tour.id}
                      className={`checkout-tour-option ${selectedTourId === tour.id ? "checkout-tour-option--active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="tour"
                        value={tour.id}
                        checked={selectedTourId === tour.id}
                        onChange={() => setSelectedTourId(tour.id)}
                        style={{ display: "none" }}
                      />
                      <div style={{ flex: 1 }}>
                        <p className="font-display" style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
                          {tour.title}
                        </p>
                        <p className="font-body" style={{ fontSize: "0.78rem", color: "rgba(245,237,216,0.4)" }}>
                          📍 {tour.location} &nbsp;·&nbsp; ⏱ {tour.duration} &nbsp;·&nbsp; 👥 {tour.availableSlots} cupos
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#C4903E" }}>
                          ${tour.price.toLocaleString("es-CO")}
                        </p>
                        <p className="font-body" style={{ fontSize: "0.7rem", color: "rgba(245,237,216,0.3)" }}>
                          por persona
                        </p>
                      </div>
                      {/* Selected checkmark */}
                      <div style={{
                        width: 20, height: 20, border: `1.5px solid ${selectedTourId === tour.id ? "#C4903E" : "rgba(245,237,216,0.15)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        background: selectedTourId === tour.id ? "#C4903E" : "transparent",
                        transition: "all 0.2s",
                      }}>
                        {selectedTourId === tour.id && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D1B0F" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Quantity */}
            {selectedTour && (
              <div className="checkout-field">
                <label className="checkout-label">
                  Cantidad de personas
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="checkout-qty-btn"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="font-display" style={{ fontSize: "2.5rem", fontWeight: 700, color: "#C4903E", minWidth: 48, textAlign: "center" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    className="checkout-qty-btn"
                    disabled={quantity >= maxQuantity}
                  >
                    +
                  </button>
                  <span className="font-body" style={{ fontSize: "0.8rem", color: "rgba(245,237,216,0.35)", marginLeft: 8 }}>
                    máx. {maxQuantity}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleReview}
              className="btn-primary"
              disabled={!selectedTourId}
              style={{
                alignSelf: "flex-start", padding: "16px 40px",
                opacity: selectedTourId ? 1 : 0.4,
                cursor: selectedTourId ? "pointer" : "not-allowed",
                border: "none",
              }}
            >
              Revisar pedido
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div className="checkout-confirm-box">
              <p className="section-label" style={{ marginBottom: 20 }}>Resumen del pedido</p>

              {[
                { label: "Tour",       value: selectedTour?.title ?? "" },
                { label: "Ubicación",  value: selectedTour?.location ?? "" },
                { label: "Duración",   value: selectedTour?.duration ?? "" },
                { label: "Personas",   value: `${quantity}` },
                { label: "Precio u.",  value: `$${selectedTour?.price.toLocaleString("es-CO")}` },
              ].map((r) => (
                <div key={r.label} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "12px 0", borderBottom: "1px solid rgba(245,237,216,0.06)",
                }}>
                  <span className="font-body" style={{ fontSize: "0.85rem", color: "rgba(245,237,216,0.4)" }}>{r.label}</span>
                  <span className="font-body" style={{ fontSize: "0.9rem" }}>{r.value}</span>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20 }}>
                <span className="font-body" style={{ fontSize: "0.9rem", color: "rgba(245,237,216,0.5)" }}>Total a pagar</span>
                <span className="font-display" style={{ fontSize: "2.25rem", fontWeight: 900, color: "#C4903E" }}>
                  ${totalPrice.toLocaleString("es-CO")}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="btn-primary"
                style={{ padding: "16px 40px", border: "none", cursor: isPending ? "wait" : "pointer", opacity: isPending ? 0.7 : 1 }}
              >
                {isPending ? "Procesando..." : "Confirmar compra"}
                {!isPending && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setStep("form")}
                className="btn-ghost"
                style={{ border: "1px solid rgba(245,237,216,0.2)", cursor: "pointer" }}
              >
                Editar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Price summary sticky ─────────────────────── */}
      <aside className="detail-purchase-card anim-fade-in">
        <p className="font-body" style={{ fontSize: "0.72rem", color: "rgba(245,237,216,0.4)", letterSpacing: "0.08em", marginBottom: 8 }}>
          RESUMEN
        </p>

        {selectedTour ? (
          <>
            <p className="font-display" style={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>
              {selectedTour.title}
            </p>
            <p className="font-body" style={{ fontSize: "0.78rem", color: "rgba(245,237,216,0.4)", marginBottom: 28 }}>
              📍 {selectedTour.location} · ⏱ {selectedTour.duration}
            </p>

            <div className="divider" style={{ marginBottom: 24 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="font-body" style={{ fontSize: "0.82rem", color: "rgba(245,237,216,0.4)" }}>Precio por persona</span>
                <span className="font-body" style={{ fontSize: "0.9rem" }}>${selectedTour.price.toLocaleString("es-CO")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="font-body" style={{ fontSize: "0.82rem", color: "rgba(245,237,216,0.4)" }}>Personas</span>
                <span className="font-body" style={{ fontSize: "0.9rem" }}>× {quantity}</span>
              </div>
            </div>

            <div className="divider" style={{ marginBottom: 20 }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="font-body" style={{ fontSize: "0.85rem", color: "rgba(245,237,216,0.5)" }}>Total</span>
              <span className="font-display" style={{ fontSize: "2.25rem", fontWeight: 900, color: "#C4903E" }}>
                ${totalPrice.toLocaleString("es-CO")}
              </span>
            </div>

            <p className="font-body" style={{
              fontSize: "0.72rem", color: "rgba(245,237,216,0.25)",
              textAlign: "center", marginTop: 20, lineHeight: 1.6,
            }}>
              El total se calcula automáticamente.<br />Los cupos se reservan al confirmar.
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p className="font-body" style={{ color: "rgba(245,237,216,0.25)", fontSize: "0.85rem", lineHeight: 1.7 }}>
              Selecciona un tour para ver el resumen de tu compra.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}