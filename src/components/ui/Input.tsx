import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseCls = "w-full bg-white/[0.03] border border-white/[0.09] text-[#F5EDD8] font-sans text-sm px-4 py-3 outline-none focus:border-[#C4903E]/50 transition-colors placeholder:text-white/20 disabled:opacity-40 disabled:cursor-not-allowed";

// ── Label ─────────────────────────────────────────────────────
export function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[0.68rem] tracking-[0.2em] uppercase text-white/40 font-sans">
      {children} {required && <span className="text-[#C4903E]">*</span>}
    </label>
  );
}

// ── Input ─────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
}

export function Input({ label, error, hint, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <Label required={props.required}>{label}</Label>}
      <input
        className={`${baseCls} ${error ? "border-red-400/50 focus:border-red-400/70" : ""} ${className}`}
        {...props}
      />
      {error && (
        <p className="flex items-center gap-1 font-sans text-xs text-red-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="font-sans text-xs text-white/25">{hint}</p>
      )}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?:  string;
}

export function Textarea({ label, error, hint, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <Label required={props.required}>{label}</Label>}
      <textarea
        className={`${baseCls} resize-none ${error ? "border-red-400/50" : ""} ${className}`}
        {...props}
      />
      {error && <p className="font-sans text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="font-sans text-xs text-white/25">{hint}</p>}
    </div>
  );
}

// ── ErrorBanner ───────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-red-400 border bg-red-500/10 border-red-500/20">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {message}
    </div>
  );
}