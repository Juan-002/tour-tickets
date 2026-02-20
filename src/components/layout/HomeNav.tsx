"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { SessionPayload } from "@/lib/auth";

const links = [
  { href: "/tours",      label: "Tours"        },
  { href: "/checkout",   label: "Comprar"      },
  { href: "/my-tickets", label: "Mis tiquetes" },
];

export default function HomeNav({ session }: { session: SessionPayload | null }) {
  const pathname            = usePathname();
  const router              = useRouter();
  const [open, setOpen]     = useState(false);

  // Cerrar menú al cambiar ruta
  useEffect(() => { setOpen(false); }, [pathname]);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/tours");
    router.refresh();
  }

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px clamp(20px, 5vw, 60px)",
        background: "linear-gradient(to bottom, rgba(13,27,15,0.97), transparent)",
        backdropFilter: "blur(2px)",
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, border: "1.5px solid #C4903E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <span className="font-display" style={{ fontSize: "1.1rem", letterSpacing: "0.05em" }}>
            Prueba <span style={{ color: "#C4903E" }}>Tour</span>
          </span>
        </a>

        {/* Links — solo desktop */}
        <div className="hidden md:flex" style={{ gap: 40 }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{ color: pathname === link.href ? "#C4903E" : undefined }}
            >
              {link.label}
            </a>
          ))}
          {session?.role === "ADMIN" && (
            <a href="/admin" className="nav-link">Admin</a>
          )}
        </div>

        {/* Auth area — solo desktop */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
          {session ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, border: "1px solid rgba(196,144,62,0.4)", background: "rgba(196,144,62,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#C4903E", fontSize: "0.75rem", fontWeight: 700 }}>
                    {session.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span style={{ color: "rgba(245,237,216,0.5)", fontSize: "0.75rem", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {session.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(245,237,216,0.5)", padding: "8px 18px", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="nav-link" style={{ fontSize: "0.75rem" }}>Ingresar</a>
              <a href="/tours" className="btn-primary" style={{ padding: "10px 24px" }}>Ver tours</a>
            </>
          )}
        </div>

        {/* Hamburguesa — solo móvil */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#F5EDD8", padding: 4 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </nav>

      {/* ── MENÚ MÓVIL ────────────────────────────────────────── */}
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.65)" }}
          className="md:hidden"
        />
      )}

      {/* Drawer */}
      <div
        className="md:hidden"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 60,
          width: "min(300px, 85vw)",
          background: "#0a1a0c",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header drawer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="font-display" style={{ fontSize: "1rem" }}>
            Prueba <span style={{ color: "#C4903E" }}>Tour</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,237,216,0.5)", padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 12px", gap: 4 }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px",
                  fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem",
                  textDecoration: "none", letterSpacing: "0.05em",
                  borderLeft: `2px solid ${isActive ? "#C4903E" : "transparent"}`,
                  background: isActive ? "rgba(196,144,62,0.08)" : "transparent",
                  color: isActive ? "#C4903E" : "rgba(245,237,216,0.6)",
                  transition: "all 0.2s",
                }}
              >
                {link.label}
              </a>
            );
          })}
          {session?.role === "ADMIN" && (
            <a
              href="/admin"
              style={{ display: "flex", alignItems: "center", padding: "14px 16px", fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", textDecoration: "none", color: "rgba(245,237,216,0.6)", borderLeft: "2px solid transparent" }}
            >
              Admin
            </a>
          )}
        </nav>

        {/* Footer drawer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 10 }}>
          {session ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 34, height: 34, background: "rgba(196,144,62,0.15)", border: "1px solid rgba(196,144,62,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#C4903E", fontWeight: 700, fontSize: "0.85rem" }}>
                    {session.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", color: "rgba(245,237,216,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.name}</p>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.65rem", color: "#C4903E", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {session.role === "ADMIN" ? "Admin" : "Usuario"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,237,216,0.4)", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{ display: "block", textAlign: "center", padding: "12px", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.5)", textDecoration: "none" }}>
                Ingresar
              </a>
              <a href="/tours" className="btn-primary" style={{ display: "block", textAlign: "center", padding: "12px" }}>
                Ver tours
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}