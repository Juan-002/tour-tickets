import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createToken, COOKIE_NAME, EXPIRES_IN } from "@/lib/auth";

const loginSchema = z.object({
  email:    z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // Crear sesión JWT
    const token = await createToken({
      id:    user.id,
      email: user.email,
      name:  user.name,
      role:  user.role,
    });

    const res = NextResponse.json({
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   EXPIRES_IN,
      path:     "/",
    });

    return res;
  } catch (error) {
    console.error("[LOGIN]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}