import { NextRequest, NextResponse } from "next/server";

import { ticketService } from "@/services/ticketService";
import { createTicketSchema } from "@/lib/validations";
import { ApiResponse, ITicket } from "@/types";

// Retornar todos los tiquetes (uso admin) o filtra por userId
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<ITicket[]>>> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const tickets = userId
      ? await ticketService.getByUser(userId)
      : await ticketService.getAll();

    return NextResponse.json({ data: tickets }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/tickets]", error);
    return NextResponse.json(
      { error: "Error al obtener los tiquetes" },
      { status: 500 }
    );
  }
}

// Crear un nuevo tiquete, resta cupos y calcula el total
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<ITicket>>> {
  try {
    const body = await req.json();

    // Validación con Zod
    const parsed = createTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const ticket = await ticketService.create(parsed.data);

    return NextResponse.json(
      { data: ticket, message: "Tiquete creado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear el tiquete";

    // Errores de negocio (cupos insuficientes, tour no encontrado)
    const isBusinessError =
      message.includes("cupos") || message.includes("Tour no encontrado");

    console.error("[POST /api/tickets]", error);
    return NextResponse.json(
      { error: message },
      { status: isBusinessError ? 422 : 500 }
    );
  }
}