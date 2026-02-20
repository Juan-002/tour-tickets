"use client";

import { useRouter, usePathname } from "next/navigation";

import { SessionPayload } from "@/lib/auth";

const navLinks = [
  { href: "/tours",      label: "Tours"        },
  { href: "/checkout",   label: "Comprar"      },
  { href: "/my-tickets", label: "Mis tiquetes" },
];

interface Props {
  children:  React.ReactNode;
  session:   SessionPayload | null;
}

export default function PublicLayoutClient({ children, session }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/tours");
    router.refresh();
  }

  return (
    <div className="grain bg-mesh">

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <nav
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          right:           0,
          zIndex:          40,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
          padding:         "24px 60px",
          background:      "linear-gradient(to bottom, rgba(13,27,15,0.95), transparent)",
          backdropFilter:  "blur(2px)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width:        36,
              height:       36,
              border:       "1.5px solid #C4903E",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <a href="/" style={{ textDecoration: "none" }}>
            <span className="font-display" style={{ fontSize: "1.1rem", letterSpacing: "0.05em" }}>
              Prueba <span style={{ color: "#C4903E" }}>Tour</span>
            </span>
          </a>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 40 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{ color: isActive ? "#C4903E" : undefined }}
              >
                {link.label}
              </a>
            );
          })}
          {/* Link admin solo para admins */}
          {session?.role === "ADMIN" && (
            <a href="/admin" className="nav-link">Admin</a>
          )}
        </div>

        {/* Auth area */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {session ? (
            <>
              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width:           32,
                    height:          32,
                    border:          "1px solid rgba(196,144,62,0.4)",
                    background:      "rgba(196,144,62,0.1)",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                  }}
                >
                  <span style={{ color: "#C4903E", fontSize: "0.75rem", fontWeight: 700 }}>
                    {session.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span style={{ color: "rgba(245,237,216,0.5)", fontSize: "0.75rem", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {session.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  background:     "transparent",
                  border:         "1px solid rgba(255,255,255,0.15)",
                  color:          "rgba(245,237,216,0.5)",
                  padding:        "8px 18px",
                  fontSize:       "0.7rem",
                  letterSpacing:  "0.15em",
                  textTransform:  "uppercase",
                  cursor:         "pointer",
                  transition:     "all 0.2s",
                  fontFamily:     "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgb(248,113,113)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,237,216,0.5)";
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                style={{
                  color:          "rgba(245,237,216,0.5)",
                  textDecoration: "none",
                  fontSize:       "0.75rem",
                  letterSpacing:  "0.15em",
                  textTransform:  "uppercase",
                }}
              >
                Ingresar
              </a>
              <a href="/tours" className="btn-primary" style={{ padding: "10px 24px" }}>
                Ver tours
              </a>
            </>
          )}
        </div>
      </nav>

      {/* ── CONTENIDO ─────────────────────────────────────────── */}
      <div style={{ paddingTop: "1px" }}>{children}</div>
    </div>
  );
}