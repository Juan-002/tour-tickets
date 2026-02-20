import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createToken, COOKIE_NAME, EXPIRES_IN } from "@/lib/auth";

const registerSchema = z.object({
  name:     z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email:    z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});


export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Verificar si el email ya existe
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
    });

    // Crear sesión JWT
    const token = await createToken({
      id:    user.id,
      email: user.email,
      name:  user.name,
      role:  user.role,
    });

    const res = NextResponse.json(
      { data: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   EXPIRES_IN,
      path:     "/",
    });

    return res;
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}