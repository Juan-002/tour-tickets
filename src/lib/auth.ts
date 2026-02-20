import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "tourtix-secret-dev-key-change-in-production"
);

const COOKIE_NAME = "tourtix-session";
const EXPIRES_IN  = 60 * 60 * 24 * 7; // 7 días

export interface SessionPayload {
  id:    string;
  email: string;
  name:  string;
  role:  string;
}

// ── Crear JWT ─────────────────────────────────────────────────
export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(SECRET);
}

// ── Verificar JWT ─────────────────────────────────────────────
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ── Obtener sesión desde cookies (Server Component) ───────────
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Nombre de la cookie ───────────────────────────────────────
export { COOKIE_NAME, EXPIRES_IN };