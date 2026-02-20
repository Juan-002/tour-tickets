import { NextRequest, NextResponse } from "next/server";

import { tourService } from "@/services/tourService";
import { createTourSchema } from "@/lib/validations";
import { ApiResponse, ITour } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Retornar un tour específico por su ID
export async function GET(
  _req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<ITour>>> {
  try {
    const { id } = await params;
    const tour = await tourService.getById(id);

    if (!tour) {
      return NextResponse.json(
        { error: "Tour no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: tour }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/tours/:id]", error);
    return NextResponse.json(
      { error: "Error al obtener el tour" },
      { status: 500 }
    );
  }
}

// Actualizar un tour existente (solo admin)
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<ITour>>> {
  try {
    const { id } = await params;
    const body = await req.json();

    // Validación parcial: no todos los campos son requeridos en edición
    const parsed = createTourSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await tourService.getById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Tour no encontrado" },
        { status: 404 }
      );
    }

    const tour = await tourService.update(id, parsed.data);

    return NextResponse.json(
      { data: tour, message: "Tour actualizado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PUT /api/tours/:id]", error);
    return NextResponse.json(
      { error: "Error al actualizar el tour" },
      { status: 500 }
    );
  }
}

// Elimina un tour (solo admin)
export async function DELETE(
  _req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params;

    const existing = await tourService.getById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Tour no encontrado" },
        { status: 404 }
      );
    }

    await tourService.delete(id);

    return NextResponse.json(
      { message: "Tour eliminado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al eliminar el tour";

    // Si el tour tiene tiquetes asociados Prisma lanzará un error de constraint
    const hasTickets = message.includes("Foreign key constraint");

    console.error("[DELETE /api/tours/:id]", error);
    return NextResponse.json(
      { error: hasTickets ? "No se puede eliminar un tour con tiquetes activos" : message },
      { status: hasTickets ? 422 : 500 }
    );
  }
}