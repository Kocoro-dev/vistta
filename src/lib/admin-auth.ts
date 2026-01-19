import { cookies } from "next/headers";

// Temporary hardcoded admin credentials
// TODO: Move to environment variables or database
const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "admin4321";
const ADMIN_SESSION_NAME = "vistta_admin_session";
const SESSION_SECRET = "vistta-admin-secret-key-change-in-production";

// Simple hash function for session token
function createSessionToken(username: string): string {
  const data = `${username}:${SESSION_SECRET}:${Date.now()}`;
  // Base64 encode for simplicity (in production, use proper JWT)
  return Buffer.from(data).toString("base64");
}

function validateSessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username] = decoded.split(":");
    return username === ADMIN_USERNAME;
  } catch {
    return false;
  }
}

export async function adminLogin(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { success: false, error: "Credenciales incorrectas" };
  }

  const token = createSessionToken(username);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return { success: true };
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_NAME)?.value;

  if (!token) return false;
  return validateSessionToken(token);
}

export async function requireAdminAuth(): Promise<boolean> {
  const isAuth = await isAdminAuthenticated();
  return isAuth;
}
