import { json, type LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const headers = () => CORS_HEADERS;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  try {
    const artists = await prisma.artist.findMany({
      where: { isActive: true },
      select: { id: true, name: true, isActive: true },
      orderBy: { id: "asc" },
    });

    return json(artists, {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api.artists] Database error:", error);
    return json(
      { error: "Failed to load artists" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
