import { NextRequest, NextResponse } from "next/server";

import { tourService } from "@/services/tourService";
import { createTourSchema } from "@/lib/validations";
import { ApiResponse, ITour } from "@/types";

// Retornar todos los tours o solo los disponibles según query param
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<ITour[]>>> {
  try {
    const { searchParams } = new URL(req.url);
    const onlyAvailable = searchParams.get("available") === "true";

    const tours = onlyAvailable
      ? await tourService.getAvailable()
      : await tourService.getAll();

    return NextResponse.json({ data: tours }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/tours]", error);
    return NextResponse.json(
      { error: "Error al obtener los tours" },
      { status: 500 }
    );
  }
}

// Crear un nuevo tour (solo admin)
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<ITour>>> {
  try {
    const body = await req.json();

    const parsed = createTourSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const tour = await tourService.create(parsed.data);

    return NextResponse.json(
      { data: tour, message: "Tour creado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/tours]", error);
    return NextResponse.json(
      { error: "Error al crear el tour" },
      { status: 500 }
    );
  }
}