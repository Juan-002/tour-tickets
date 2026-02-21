"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useRef } from "react";

export default function ToursFilter({
  total,
  filtered,
}: {
  total:    number;
  filtered: number;
}) {
  const router    = useRouter();
  const pathname  = usePathname();
  const params    = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearch = params.get("q")    ?? "";
  const currentSort   = params.get("sort") ?? "default";
  const hasFilters    = currentSearch || currentSort !== "default";

  function updateParams(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "default") next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams("q", value), 350);
  }

  const inputBase: React.CSSProperties = {
    background: "#0D1B0F",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#F5EDD8",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.875rem",
    padding: "10px 16px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 28 }}>

      {/* ── Controles ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>

        {/* Buscador */}
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="rgba(196,144,62,0.5)" strokeWidth="2"
            style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            defaultValue={currentSearch}
            onChange={handleSearch}
            placeholder="Buscar por nombre, lugar..."
            style={{ ...inputBase, paddingLeft: 40 }}
            onFocus={(e)  => (e.target.style.borderColor = "rgba(196,144,62,0.5)")}
            onBlur={(e)   => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
          />
        </div>

        {/* Ordenar */}
        <div style={{ position: "relative", flexShrink: 0, minWidth: 200 }}>
          <select
            value={currentSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            style={{ ...inputBase, paddingRight: 36, appearance: "none", cursor: "pointer" }}
            onFocus={(e)  => (e.target.style.borderColor = "rgba(196,144,62,0.5)")}
            onBlur={(e)   => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
          >
            <option value="default">Ordenar por defecto</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="rgba(196,144,62,0.6)" strokeWidth="2"
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        {/* Botón limpiar */}
        {hasFilters && (
          <button
            onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(245,237,216,0.4)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "10px 16px",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(196,144,62,0.35)";
              e.currentTarget.style.color = "#C4903E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(245,237,216,0.4)";
            }}
          >
            ✕ Limpiar
          </button>
        )}

        {/* Spinner mientras filtra */}
        {isPending && (
          <div style={{
            width: 16, height: 16, flexShrink: 0,
            border: "2px solid rgba(196,144,62,0.2)",
            borderTopColor: "#C4903E", borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }} />
        )}
      </div>

      {/* ── Resumen de resultados ──────────────────────────── */}
      {hasFilters && (
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", color: "rgba(245,237,216,0.35)", letterSpacing: "0.04em" }}>
          {filtered === total
            ? `${total} tours`
            : <><span style={{ color: "#C4903E" }}>{filtered}</span>{` de ${total} tours`}</>
          }
          {currentSearch && (
            <span style={{ color: "rgba(196,144,62,0.65)" }}> · &quot;{currentSearch}&quot;</span>
          )}
        </p>
      )}
    </div>
  );
}