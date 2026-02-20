//  Home que redirige a /tours
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/tours");
}