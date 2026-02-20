//Editar tour
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

import { CreateTourDTO, ITour } from "@/types";

const inputCls = "w-full bg-white/[0.03] border border-white/[0.09] text-[#F5EDD8] font-sans text-sm px-4 py-3 outline-none focus:border-[#C4903E]/50 transition-colors placeholder:text-white/20";

export default function EditTourPage() {
  const router                       = useRouter();
  const { id }                       = useParams<{ id: string }>();
  const [form, setForm]              = useState<Partial<CreateTourDTO>>({});
  const [loading, setLoading]        = useState(true);
  const [error, setError]            = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchTour() {
      try {
        const res  = await fetch(`/api/tours/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Tour no encontrado");
        const tour: ITour = json.data;
        setForm({
          title: tour.title, description: tour.description,
          price: tour.price, imageUrl: tour.imageUrl,
          totalSlots: tour.totalSlots, location: tour.location,
          duration: tour.duration,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar el tour");
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res  = await fetch(`/api/tours/${id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) return setError(json.error ?? "Error al actualizar el tour");
        router.push("/admin/tours");
        router.refresh();
      } catch {
        setError("Error de conexión. Intenta de nuevo.");
      }
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <div className="w-10 h-10 border border-[#C4903E]/30 border-t-[#C4903E] rounded-full animate-spin" />
        <p className="font-sans text-xs tracking-widest uppercase text-white/30">Cargando tour...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-2xl gap-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <a href="/admin/tours" className="text-white/30 hover:text-[#C4903E] transition-colors font-sans text-sm">Tours</a>
          <span className="font-sans text-white/20">/</span>
          <span className="text-white/60 font-sans text-sm truncate max-w-[200px]">
            {form.title ?? "Editar tour"}
          </span>
        </div>
        <h2 className="font-serif text-4xl font-black text-[#F5EDD8]">
          Editar <span className="italic text-[#C4903E]">tour</span>
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-red-400 border bg-red-500/10 border-red-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <Field label="Nombre del tour" required>
          <input name="title" type="text" value={form.title ?? ""} onChange={handleChange}
            required placeholder="Ej: Tour por la Ciudad Perdida" className={inputCls} />
        </Field>

        <Field label="Descripción" required>
          <textarea name="description" value={form.description ?? ""} onChange={handleChange}
            required rows={4} placeholder="Describe la experiencia del tour..."
            className={`${inputCls} resize-none`} />
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Ubicación" required>
            <input name="location" type="text" value={form.location ?? ""} onChange={handleChange}
              required placeholder="Ej: Santa Marta, Colombia" className={inputCls} />
          </Field>
          <Field label="Duración" required>
            <input name="duration" type="text" value={form.duration ?? ""} onChange={handleChange}
              required placeholder="Ej: 3 días / 2 noches" className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Precio por persona (COP)" required>
            <input name="price" type="number" value={form.price || ""} onChange={handleChange}
              required min={1} placeholder="Ej: 320000" className={inputCls} />
          </Field>
          <Field label="Cupos totales" required>
            <input name="totalSlots" type="number" value={form.totalSlots || ""} onChange={handleChange}
              required min={1} placeholder="Ej: 20" className={inputCls} />
          </Field>
        </div>

        <Field label="URL de imagen">
          <input name="imageUrl" type="url" value={form.imageUrl ?? ""} onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg" className={inputCls} />
          {form.imageUrl && (
            <div className="h-40 mt-2 overflow-hidden border border-white/10">
              <img src={form.imageUrl} alt="preview" className="object-cover w-full h-full" />
            </div>
          )}
        </Field>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={isPending}
            className="inline-flex items-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans font-medium text-sm tracking-widest uppercase px-8 py-3 hover:bg-[#D4A24E] transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {isPending ? "Guardando..." : (
              <>
                Guardar cambios
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
              </>
            )}
          </button>
          <a
            href="/admin/tours"
            className="inline-flex items-center gap-2 border border-white/20 text-[#F5EDD8] font-sans text-sm tracking-widest uppercase px-6 py-3 hover:border-[#C4903E]/40 hover:bg-[#C4903E]/5 transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
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