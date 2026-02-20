import { NextRequest, NextResponse } from "next/server";

import { ticketService } from "@/services/ticketService";
import { ApiResponse, ITicket } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ── GET /api/tickets/:id ──────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<ITicket>>> {
  try {
    const { id } = await params;
    const ticket = await ticketService.getById(id);

    if (!ticket) {
      return NextResponse.json(
        { error: "Tiquete no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: ticket }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/tickets/:id]", error);
    return NextResponse.json(
      { error: "Error al obtener el tiquete" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/tickets/:id ───────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params;
    await ticketService.cancel(id);

    return NextResponse.json(
      { message: "Tiquete cancelado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al cancelar el tiquete";

    console.error("[DELETE /api/tickets/:id]", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}