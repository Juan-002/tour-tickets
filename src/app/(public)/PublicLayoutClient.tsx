"use client";

import { useRouter, usePathname } from "next/navigation";

import { SessionPayload } from "@/lib/auth";
import HomeNav from "@/components/layout/HomeNav";

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
<HomeNav session={session} />

      {/* ── CONTENIDO ─────────────────────────────────────────── */}
      <div style={{ paddingTop: "1px" }}>{children}</div>
    </div>
  );
}