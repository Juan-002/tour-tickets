"use client";

// src/app/(admin)/admin/tours/new/page.tsx
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const inputCls = "w-full bg-white/[0.03] border border-white/[0.09] text-[#F5EDD8] font-sans text-sm px-4 py-3 outline-none focus:border-[#C4903E]/50 transition-colors placeholder:text-white/20";

const EMPTY_FORM = {
  title: "", description: "", price: 0, imageUrl: "",
  totalSlots: 0, location: "", duration: "", nights: 0,
  petsAllowed: false, kidsAllowed: true,
  hasTransport: false, hasLodging: false, lodgingType: "",
};

export default function NewTourPage() {
  const router                       = useRouter();
  const [form, setForm]              = useState(EMPTY_FORM);
  const [error, setError]            = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res  = await fetch("/api/tours", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) return setError(json.error ?? "Error al crear el tour");
        router.push("/admin/tours");
        router.refresh();
      } catch {
        setError("Error de conexión. Intenta de nuevo.");
      }
    });
  }

  return (
    <div className="flex flex-col max-w-2xl gap-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <a href="/admin/tours" className="text-white/30 hover:text-[#C4903E] transition-colors font-sans text-sm">Tours</a>
          <span className="font-sans text-white/20">/</span>
          <span className="font-sans text-sm text-white/60">Nuevo tour</span>
        </div>
        <h2 className="font-serif text-4xl font-black text-[#F5EDD8]">
          Crear <span className="italic text-[#C4903E]">tour</span>
        </h2>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-red-400 border bg-red-500/10 border-red-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Info básica */}
        <SectionTitle>Información básica</SectionTitle>

        <Field label="Nombre del tour" required>
          <input name="title" type="text" value={form.title} onChange={handleChange} required placeholder="Ej: Tour por la Ciudad Perdida" className={inputCls} />
        </Field>

        <Field label="Descripción" required>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe la experiencia del tour..." className={`${inputCls} resize-none`} />
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Ubicación" required>
            <input name="location" type="text" value={form.location} onChange={handleChange} required placeholder="Ej: Santa Marta, Colombia" className={inputCls} />
          </Field>
          <Field label="Duración" required>
            <input name="duration" type="text" value={form.duration} onChange={handleChange} required placeholder="Ej: 3 días / 2 noches" className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <Field label="Precio por persona (COP)" required>
            <input name="price" type="number" value={form.price || ""} onChange={handleChange} required min={1} placeholder="320000" className={inputCls} />
          </Field>
          <Field label="Cupos totales" required>
            <input name="totalSlots" type="number" value={form.totalSlots || ""} onChange={handleChange} required min={1} placeholder="20" className={inputCls} />
          </Field>
          <Field label="Número de noches">
            <input name="nights" type="number" value={form.nights || ""} onChange={handleChange} min={0} placeholder="2" className={inputCls} />
          </Field>
        </div>

        <Field label="URL de imagen">
          <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className={inputCls} />
          {form.imageUrl && (
            <div className="h-40 mt-2 overflow-hidden border border-white/10">
              <img src={form.imageUrl} alt="preview" className="object-cover w-full h-full" />
            </div>
          )}
        </Field>

        {/* Características */}
        <SectionTitle>Características del tour</SectionTitle>

        <div className="grid grid-cols-2 gap-4">
          <CheckField name="petsAllowed"  checked={form.petsAllowed}  onChange={handleChange} label="🐾 Se permiten mascotas" />
          <CheckField name="kidsAllowed"  checked={form.kidsAllowed}  onChange={handleChange} label="👶 Apto para niños"      />
          <CheckField name="hasTransport" checked={form.hasTransport} onChange={handleChange} label="🚌 Transporte incluido"  />
          <CheckField name="hasLodging"   checked={form.hasLodging}   onChange={handleChange} label="🏨 Alojamiento incluido" />
        </div>

        {form.hasLodging && (
          <Field label="Tipo de alojamiento">
            <select name="lodgingType" value={form.lodgingType} onChange={handleChange} className={inputCls}>
              <option value="">Selecciona tipo...</option>
              <option value="Hotel">Hotel</option>
              <option value="Residencia">Residencia</option>
              <option value="Airbnb">Airbnb</option>
              <option value="Camping">Camping</option>
              <option value="Hostal">Hostal</option>
            </select>
          </Field>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={isPending}
            className="inline-flex items-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans font-medium text-sm tracking-widest uppercase px-8 py-3 hover:bg-[#D4A24E] transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {isPending ? "Guardando..." : "Crear tour"}
          </button>
          <a href="/admin/tours" className="inline-flex items-center border border-white/20 text-[#F5EDD8] font-sans text-sm tracking-widest uppercase px-6 py-3 hover:border-[#C4903E]/40 transition-colors">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <p className="text-[0.68rem] tracking-[0.2em] uppercase text-[#C4903E] font-sans">✦ {children}</p>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.68rem] tracking-[0.2em] uppercase text-white/40 font-sans">
        {label} {required && <span className="text-[#C4903E]">*</span>}
      </label>
      {children}
    </div>
  );
}

function CheckField({ name, checked, onChange, label }: {
  name: string; checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) {
  return (
    <label
      className="flex items-center gap-3 px-4 py-3 transition-all duration-200 cursor-pointer select-none"
      style={{
        background:  checked ? "rgba(196,144,62,0.06)" : "rgba(255,255,255,0.02)",
        border:      `1px solid ${checked ? "rgba(196,144,62,0.3)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      <div
        className="flex items-center justify-center w-5 h-5 transition-all duration-200 shrink-0"
        style={{ background: checked ? "#C4903E" : "transparent", border: `1px solid ${checked ? "#C4903E" : "rgba(255,255,255,0.2)"}` }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D1B0F" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden" />
      <span className="font-sans text-sm" style={{ color: checked ? "#F5EDD8" : "rgba(245,237,216,0.4)" }}>{label}</span>
    </label>
  );
}