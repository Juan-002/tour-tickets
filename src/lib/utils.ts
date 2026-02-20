//Helpers
// ── Formato de precios ────────────────────────────────────────
/**
 * Formatea un número como precio en pesos colombianos.
 * Ej: 320000 → "$320.000"
 */
export function formatPrice(value: number, currency = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style:    "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

// ── Formato de fechas ─────────────────────────────────────────
/**
 * Formatea una fecha en español colombiano.
 * Ej: 2025-02-20 → "20 de febrero de 2025"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  }).format(new Date(date));
}

/**
 * Formatea fecha y hora corta.
 * Ej: "20 feb. 2025, 3:45 p. m."
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year:   "numeric",
    month:  "short",
    day:    "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// ── Cálculo de tiquetes ───────────────────────────────────────
/**
 * Calcula el precio total de un tiquete.
 */
export function calculateTotal(pricePerPerson: number, quantity: number): number {
  return pricePerPerson * quantity;
}

/**
 * Calcula el porcentaje de ocupación de un tour.
 * Ej: 15 vendidos de 20 totales → 75
 */
export function calculateOccupancy(totalSlots: number, availableSlots: number): number {
  if (totalSlots === 0) return 0;
  return Math.round(((totalSlots - availableSlots) / totalSlots) * 100);
}

// ── Strings ───────────────────────────────────────────────────
/**
 * Trunca un texto a un máximo de caracteres.
 * Ej: "Tour muy largo..." → "Tour muy la..."
 */
export function truncate(text: string, max = 100): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

/**
 * Convierte la primera letra en mayúscula.
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// ── Clases CSS condicionales ──────────────────────────────────
/**
 * Une clases CSS ignorando valores falsy.
 * Alternativa ligera a clsx/classnames.
 * Ej: cn("base", isActive && "active", undefined) → "base active"
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ── Validaciones rápidas ──────────────────────────────────────
/**
 * Verifica si una URL es válida.
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifica si hay cupos disponibles en un tour.
 */
export function hasAvailableSlots(availableSlots: number, requested: number): boolean {
  return availableSlots >= requested;
}