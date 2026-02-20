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

          {/* ── CONTENIDO DINÁMICO ─────────────────────────────── */}
          <div style={{ paddingTop: "1px" }}>{children}</div>

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