//Layout protegido
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "admin123";
const AUTH_KEY       = "tourtix_admin_auth";

const navItems = [
  {
    label: "Dashboard",
    href:  "/admin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: "Tours",
    href:  "/admin/tours",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "Tiquetes",
    href:  "/admin/tickets",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname                      = usePathname();
  const [isAuthenticated, setIsAuth]  = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [password, setPassword]       = useState("");
  const [error, setError]             = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Recuperar sesión persistida ────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved === "true") setIsAuth(true);
    setIsLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuth(true);
      setError("");
    } else {
      setError("Contraseña incorrecta. Intenta de nuevo.");
    }
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    setIsAuth(false);
    setPassword("");
  }

  // ── Spinner mientras verifica localStorage ─────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1B0F] flex items-center justify-center">
        <div className="w-8 h-8 border border-[#C4903E]/30 border-t-[#C4903E] rounded-full animate-spin" />
      </div>
    );
  }

  // ── LOGIN ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8] flex items-center justify-center"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(196,144,62,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(34,87,45,0.25) 0%, transparent 60%)",
        }}
      >
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 border border-[#C4903E]/40 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4903E" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-black">
              Prueba <span className="text-[#C4903E]">Tour</span>
            </h1>
            <p className="mt-2 font-sans text-sm tracking-widest uppercase text-white/40">
              Panel Administrativo
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] tracking-[0.2em] uppercase text-white/40 font-sans">
                Contraseña de acceso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/[0.04] border border-white/10 text-[#F5EDD8] font-sans text-sm px-4 py-3 outline-none focus:border-[#C4903E]/50 transition-colors placeholder:text-white/20"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 font-sans text-xs text-red-400 border bg-red-500/10 border-red-500/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans font-medium text-sm tracking-widest uppercase px-6 py-3 mt-2 hover:bg-[#D4A24E] transition-colors"
            >
              Ingresar al panel
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>

          <p className="mt-8 font-sans text-xs text-center text-white/20">
            <a href="/" className="hover:text-[#C4903E] transition-colors">← Volver al sitio</a>
          </p>
        </div>
      </div>
    );
  }

  // ── ADMIN SHELL ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8] flex">

      <aside className={`flex flex-col shrink-0 border-r border-white/[0.06] bg-[#0a1a0c] transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
          {sidebarOpen && (
            <span className="font-serif text-base text-[#F5EDD8]">
              Prueba <span className="text-[#C4903E]">Tour</span>
              <span className="text-[0.6rem] text-white/30 tracking-widest uppercase font-sans ml-2">Admin</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-[#C4903E] transition-colors ml-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen ? <path d="M19 12H5M12 5l-7 7 7 7"/> : <path d="M5 12h14M12 5l7 7-7 7"/>}
            </svg>
          </button>
        </div>

        {/* <nav className="flex flex-col flex-1 gap-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 text-sm font-sans border-l-2 ${
                  isActive
                    ? "bg-[#C4903E]/10 text-[#C4903E] border-[#C4903E]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border-transparent"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="tracking-wide">{item.label}</span>}
              </a>
            );
          })}
        </nav> */}

        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-sans text-white/30 hover:text-red-400 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
          {sidebarOpen && (
            <a href="/" className="flex items-center gap-3 px-3 py-2 mt-1 font-sans text-xs transition-colors text-white/20 hover:text-white/50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              Ver sitio público
            </a>
          )}
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] bg-[#0a1a0c]/50 backdrop-blur-sm">
          <div>
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-white/30 font-sans">Panel administrativo</p>
            <p className="font-serif text-lg font-bold">
              {navItems.find((n) => n.href === pathname)?.label ?? "Admin"}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#C4903E]/10 border border-[#C4903E]/20 px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C4903E] animate-pulse" />
            <span className="text-[0.68rem] text-[#C4903E] font-sans tracking-widest uppercase">Admin</span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}