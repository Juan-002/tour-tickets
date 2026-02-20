const links = [
  { href: "/tours",      label: "Tours"        },
  { href: "/checkout",   label: "Comprar"      },
  { href: "/my-tickets", label: "Mis tiquetes" },
  { href: "/admin",      label: "Admin"        },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] px-[60px] py-8 flex items-center justify-between">
      <span className="font-serif text-base text-[#F5EDD8]">
        Prueba <span style={{ color: "#C4903E" }}>Tour</span>
      </span>

      <div className="flex gap-8">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-sans text-xs tracking-widest uppercase text-white/25 hover:text-[#C4903E] transition-colors no-underline"
          >
            {link.label}
          </a>
        ))}
      </div>

      <p className="font-sans text-xs tracking-wide text-white/20">
        © 2026 Juan Fernando. Todos los derechos reservados.
      </p>
    </footer>
  );
}