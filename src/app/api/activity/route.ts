import { NextResponse } from "next/server";
import { generateRandomActivity } from "@/lib/social-proof-data";

/**
 * GET /api/activity
 *
 * Devuelve un mensaje de actividad aleatorio para el social proof.
 * Server-side para que los datos no sean inspeccionables desde el cliente.
 */
export async function GET() {
  const activity = generateRandomActivity();

  // Añadir headers para evitar caché
  return NextResponse.json(activity, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
  });
}
