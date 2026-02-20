import type { ReactNode } from "react";

import { getSession } from "@/lib/auth";

import PublicLayoutClient from "./PublicLayoutClient";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  return <PublicLayoutClient session={session}>{children}</PublicLayoutClient>;
}