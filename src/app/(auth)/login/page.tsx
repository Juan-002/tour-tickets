"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const router                       = useRouter();
  const [email, setEmail]            = useState("");
  const [password, setPassword]      = useState("");
  const [error, setError]            = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res  = await fetch("/api/auth/login", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ email, password }),
        });
        const json = await res.json();
        if (!res.ok) return setError(json.error ?? "Error al iniciar sesión");
        router.push("/my-tickets");
        router.refresh();
      } catch {
        setError("Error de conexión. Intenta de nuevo.");
      }
    });
  }

  return (
    <main
      className="min-h-screen bg-[#0D1B0F] text-[#F5EDD8] flex items-center justify-center"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(196,144,62,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(34,87,45,0.25) 0%, transparent 60%)",
      }}
    >
      <div className="w-full max-w-sm px-6">

        {/* Logo */}
        <div className="mb-10 text-center">
          <a href="/" className="no-underline">
            <h1 className="font-serif text-4xl font-black text-[#F5EDD8]">
              Tour<span className="text-[#C4903E]">Tix</span>
            </h1>
          </a>
          <p className="mt-2 font-sans text-xs tracking-widest uppercase text-white/35">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 mb-6 font-sans text-sm text-red-400 border bg-red-500/10 border-red-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[0.68rem] tracking-[0.2em] uppercase text-white/40">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full bg-white/[0.03] border border-white/[0.09] text-[#F5EDD8] font-sans text-sm px-4 py-3 outline-none focus:border-[#C4903E]/50 transition-colors placeholder:text-white/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-[0.68rem] tracking-[0.2em] uppercase text-white/40">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-white/[0.03] border border-white/[0.09] text-[#F5EDD8] font-sans text-sm px-4 py-3 outline-none focus:border-[#C4903E]/50 transition-colors placeholder:text-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans font-medium text-sm tracking-widest uppercase py-3.5 mt-2 hover:bg-[#D4A24E] transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {isPending ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Links */}
        <div className="flex items-center justify-between mt-6">
          <a href="/register" className="font-sans text-xs text-white/30 hover:text-[#C4903E] transition-colors">
            ¿No tienes cuenta? Regístrate
          </a>
          <a href="/tours" className="font-sans text-xs text-white/30 hover:text-[#C4903E] transition-colors">
            Ver tours →
          </a>
        </div>
      </div>
    </main>
  );
}