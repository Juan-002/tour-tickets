"use client";

// src/app/(admin)/admin/layout.tsx
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { SessionPayload } from "@/lib/auth";

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
  const router                        = useRouter();
  const [session, setSession]         = useState<SessionPayload | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Verificar sesión JWT ───────────────────────────────────
  useEffect(() => {
    async function checkSession() {
      try {
        const res  = await fetch("/api/auth/me");
        const json = await res.json();
        if (!res.ok || json.data?.role !== "ADMIN") {
          router.push("/login");
          return;
        }
        setSession(json.data);
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  // ── Spinner ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1B0F] flex items-center justify-center">
        <div className="w-8 h-8 border border-[#C4903E]/30 border-t-[#C4903E] rounded-full animate-spin" />
      </div>
    );
  }

  // ── ADMIN SHELL ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8] flex">

      {/* Sidebar */}
      <aside className={`flex flex-col shrink-0 border-r border-white/[0.06] bg-[#0a1a0c] transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}>

        {/* Header */}
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

        {/* Nav */}
        <nav className="flex flex-col flex-1 gap-1 p-3">
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
        </nav>

        {/* Footer sidebar */}
        <div className="p-3 border-t border-white/[0.06]">
          {/* Info usuario */}
          {sidebarOpen && session && (
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <div className="w-7 h-7 bg-[#C4903E]/20 border border-[#C4903E]/30 flex items-center justify-center shrink-0">
                <span className="text-[0.7rem] font-bold text-[#C4903E]">
                  {session.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-sans text-xs truncate text-white/60">{session.name}</p>
                <p className="font-sans text-[0.6rem] text-[#C4903E] tracking-widest uppercase">Admin</p>
              </div>
            </div>
          )}

          {/* Cerrar sesión */}
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

          {/* Ver sitio */}
          {sidebarOpen && (
            <a
              href="/tours"
              className="flex items-center gap-3 px-3 py-2 mt-1 font-sans text-xs transition-colors text-white/20 hover:text-white/50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              Ver sitio público
            </a>
          )}
        </div>
      </aside>

      {/* Main */}
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