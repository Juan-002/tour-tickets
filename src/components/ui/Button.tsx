import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  loading?: boolean;
  icon?:    React.ReactNode;
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?:    Size;
  icon?:    React.ReactNode;
}

const variantCls: Record<Variant, string> = {
  primary: "bg-[#C4903E] text-[#0D1B0F] hover:bg-[#D4A24E]",
  ghost:   "border border-white/20 text-[#F5EDD8] hover:border-[#C4903E]/40 hover:bg-[#C4903E]/5",
  danger:  "border border-red-400/30 text-red-400 hover:border-red-400/60 hover:bg-red-400/5",
};

const sizeCls: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-10 py-4 text-sm",
};

const baseCls = "inline-flex items-center gap-2 font-sans font-medium tracking-widest uppercase transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

// ── Button ────────────────────────────────────────────────────
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`${baseCls} ${variantCls[variant]} ${sizeCls[size]} ${loading ? "cursor-wait" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      ) : icon}
      {children}
    </button>
  );
}

// ── LinkButton ────────────────────────────────────────────────
export function LinkButton({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={`${baseCls} ${variantCls[variant]} ${sizeCls[size]} no-underline ${className}`}
      {...props}
    >
      {icon}
      {children}
    </a>
  );
}