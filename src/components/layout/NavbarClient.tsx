"use client";

import { usePathname, useRouter } from "next/navigation";

import { SessionPayload } from "@/lib/auth";

const links = [
  { href: "/tours",      label: "Tours"        },
  { href: "/checkout",   label: "Comprar"      },
  { href: "/my-tickets", label: "Mis tiquetes" },
];

interface NavbarClientProps {
  session: SessionPayload | null;
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/tours");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-[60px] py-5 bg-[rgba(13,27,15,0.95)] backdrop-blur-md border-b border-white/[0.06]">

      {/* Logo */}
      <a href="/" className="no-underline">
        <span className="font-serif text-lg tracking-wide text-[#F5EDD8]">
          Tour<span className="text-[#C4903E]">Tix</span>
        </span>
      </a>

      {/* Links */}
      <div className="flex gap-10">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <a
              key={link.href}
              href={link.href}
              className="relative font-sans text-sm tracking-widest no-underline uppercase transition-colors duration-200"
              style={{ color: isActive ? "#C4903E" : "rgba(245,237,216,0.6)" }}
            >
              {link.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px bg-[#C4903E] transition-all duration-300"
                style={{ width: isActive ? "100%" : "0%" }}
              />
            </a>
          );
        })}
      </div>

      {/* Auth area */}
      <div className="flex items-center gap-3">
        {session ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#C4903E]/20 border border-[#C4903E]/30 flex items-center justify-center">
                <span className="font-sans text-xs font-bold text-[#C4903E]">
                  {session.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-sans text-xs text-white/50 max-w-[120px] truncate">
                {session.name}
              </span>
            </div>
            {session.role === "ADMIN" && (
              <a
                href="/admin"
                className="font-sans text-xs text-white/30 hover:text-[#C4903E] transition-colors tracking-widest uppercase"
              >
                Admin
              </a>
            )}
            <button
              onClick={handleLogout}
              className="font-sans text-xs tracking-widest uppercase transition-colors text-white/30 hover:text-red-400"
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="font-sans text-xs text-white/50 hover:text-[#F5EDD8] transition-colors tracking-widest uppercase"
            >
              Ingresar
            </a>
            <a
              href="/checkout"
              className="inline-flex items-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans font-medium text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#D4A24E] transition-colors"
            >
              Comprar tiquete
            </a>
          </>
        )}
      </div>
    </nav>
  );
}