// src/app/layout.tsx
import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "Prueba Tour",
  description: "Reserva tours increíbles en Colombia",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8] overflow-x-hidden font-sans">
        
        <div className="grain bg-mesh">

          {/* ── NAVBAR ────────────────────────────────────────────── */}
          <nav
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 60px",
              background:
                "linear-gradient(to bottom, rgba(13,27,15,0.95), transparent)",
              backdropFilter: "blur(2px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "1.5px solid #C4903E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C4903E"
                  strokeWidth="1.5"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <span
                className="font-display"
                style={{ fontSize: "1.1rem", letterSpacing: "0.05em" }}
              >
                Prueba <span style={{ color: "#C4903E" }}>Tour</span>
              </span>
            </div>

            <div style={{ display: "flex", gap: 40 }}>
              <a href="/tours" className="nav-link">
                Tours
              </a>
              <a href="/checkout" className="nav-link">
                Comprar
              </a>
              <a href="/my-tickets" className="nav-link">
                Mis tiquetes
              </a>
              <a href="/admin" className="nav-link">
                Admin
              </a>
            </div>

            <a
              href="/tours"
              className="btn-primary"
              style={{ padding: "10px 24px" }}
            >
              Ver tours
            </a>
          </nav>

          {/* ── CONTENIDO DINÁMICO ─────────────────────────────── */}
          <div style={{ paddingTop: "120px" }}>{children}</div>

          {/* ── FOOTER ───────────────────────────────────────────── */}
          <footer
            style={{
              borderTop: "1px solid rgba(245,237,216,0.08)",
              padding: "40px 60px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "120px",
            }}
          >
            <span className="font-display" style={{ fontSize: "1rem" }}>
              Prueba <span style={{ color: "#C4903E" }}>Tour</span>
            </span>
            <p
              className="font-body"
              style={{
                fontSize: "0.8rem",
                color: "rgba(245,237,216,0.3)",
                letterSpacing: "0.05em",
              }}
            >
              © 2026 Juan Fernando. Todos los derechos reservados.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              <a href="/admin" className="nav-link">
                Admin
              </a>
              <a href="/my-tickets" className="nav-link">
                Mis tiquetes
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}