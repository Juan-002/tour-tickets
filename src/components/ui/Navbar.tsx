"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1B0F]/95 backdrop-blur-sm border-b border-[#C4903E]/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-[#C4903E] flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C4903E"
              strokeWidth="1.5"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
          </div>
          <span className="font-display text-lg tracking-wide">
            Prueba <span className="text-[#C4903E]">Tour</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/tours" className="nav-link">Tours</Link>
          <Link href="/checkout" className="nav-link">Comprar</Link>
          <Link href="/my-tickets" className="nav-link">Mis tiquetes</Link>
          <Link href="/admin" className="nav-link">Admin</Link>

          <Link
            href="/tours"
            className="bg-[#C4903E] text-[#0D1B0F] px-5 py-2 text-sm font-semibold"
          >
            Ver tours
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-[2px] bg-[#C4903E]" />
          <span className="w-6 h-[2px] bg-[#C4903E]" />
          <span className="w-6 h-[2px] bg-[#C4903E]" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0D1B0F] border-t border-[#C4903E]/10 px-6 py-6 flex flex-col gap-6">
          <Link href="/tours" onClick={() => setOpen(false)}>Tours</Link>
          <Link href="/checkout" onClick={() => setOpen(false)}>Comprar</Link>
          <Link href="/my-tickets" onClick={() => setOpen(false)}>Mis tiquetes</Link>
          <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>

          <Link
            href="/tours"
            className="bg-[#C4903E] text-[#0D1B0F] px-5 py-3 text-center font-semibold"
            onClick={() => setOpen(false)}
          >
            Ver tours
          </Link>
        </div>
      )}
    </nav>
  );
}