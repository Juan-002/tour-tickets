import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

import MyTicketsClient from "./MyTicketsClient";

export default async function MyTicketsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <MyTicketsClient userId={session.id} userName={session.name} />;
}