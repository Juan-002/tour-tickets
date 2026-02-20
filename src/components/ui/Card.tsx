interface CardProps {
  children:   React.ReactNode;
  className?: string;
  hover?:     boolean;
  gold?:      boolean;   // borde dorado
  padding?:   "sm" | "md" | "lg";
}

const paddingCls = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

// ── Card base ─────────────────────────────────────────────────
export function Card({ children, className = "", hover = false, gold = false, padding = "md" }: CardProps) {
  return (
    <div
      className={`
        bg-[#162018]/90
        border
        ${gold ? "border-[#C4903E]/20" : "border-white/[0.07]"}
        ${hover ? "hover:-translate-y-1 hover:border-[#C4903E]/30 transition-all duration-300 cursor-pointer" : ""}
        ${paddingCls[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────
interface StatCardProps {
  label:    string;
  value:    string | number;
  sub?:     string;
  icon?:    React.ReactNode;
  accent?:  string;
}

export function StatCard({ label, value, sub, icon, accent = "#C4903E" }: StatCardProps) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] p-6 hover:border-white/[0.12] transition-colors duration-300">
      {icon && (
        <div
          className="flex items-center justify-center mb-4 w-11 h-11"
          style={{ border: `1px solid ${accent}25` }}
        >
          {icon}
        </div>
      )}
      <p className="font-serif text-3xl font-black" style={{ color: accent }}>
        {value}
      </p>
      <p className="font-sans text-[0.68rem] text-white/40 tracking-wide mt-1">{label}</p>
      {sub && <p className="font-sans text-[0.65rem] text-white/25 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────
interface EmptyStateProps {
  title:    string;
  desc?:    string;
  icon?:    React.ReactNode;
  action?:  React.ReactNode;
}

export function EmptyState({ title, desc, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      {icon && (
        <div className="w-16 h-16 border border-[#C4903E]/20 flex items-center justify-center">
          {icon}
        </div>
      )}
      <p className="font-serif text-xl font-bold text-white/50">{title}</p>
      {desc && <p className="max-w-xs font-sans text-sm text-white/30">{desc}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}