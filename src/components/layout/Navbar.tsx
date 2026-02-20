// src/components/layout/Navbar.tsx
import { getSession } from "@/lib/auth";

import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getSession();
  return <NavbarClient session={session} />;
}


// "use client";

// import { usePathname } from "next/navigation";

// const links = [
//   { href: "/tours",      label: "Tours"        },
//   { href: "/checkout",   label: "Comprar"      },
//   { href: "/my-tickets", label: "Mis tiquetes" },
//   { href: "/admin",      label: "Admin"        },
// ];

// export default function Navbar() {
//   const pathname = usePathname();

//   return (
//     <nav className="sticky top-0 z-40 flex items-center justify-between px-[60px] py-5 bg-[rgba(13,27,15,0.95)] backdrop-blur-md border-b border-white/[0.06]">

//       {/* Logo */}
//       <a href="/" className="no-underline">
//         <span className="font-serif text-lg tracking-wide text-[#F5EDD8]">
//           Prueba <span style={{ color: "#C4903E" }}>Tour</span>
//         </span>
//       </a>

//       {/* Links */}
//       <div className="flex gap-10">
//         {links.map((link) => {
//           const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
//           return (
//             <a
//               key={link.href}
//               href={link.href}
//               className="relative font-sans text-sm tracking-widest no-underline uppercase transition-colors duration-200 group"
//               style={{ color: isActive ? "#C4903E" : "rgba(245,237,216,0.6)" }}
//             >
//               {link.label}
//               <span
//                 className="absolute -bottom-0.5 left-0 h-px bg-[#C4903E] transition-all duration-300"
//                 style={{ width: isActive ? "100%" : "0%" }}
//               />
//             </a>
//           );
//         })}
//       </div>

//       {/* CTA */}
//       <a
//         href="/checkout"
//         className="inline-flex items-center gap-2 bg-[#C4903E] text-[#0D1B0F] font-sans font-medium text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#D4A24E] transition-colors"
//       >
//         Comprar tiquete
//       </a>
//     </nav>
//   );
// }