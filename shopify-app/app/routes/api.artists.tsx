import type { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request: _request }: LoaderFunctionArgs) => {
  const artists = await prisma.artist.findMany({
    where: { isActive: true },
    select: { id: true, name: true, isActive: true },
    orderBy: { id: "asc" },
  });

  return Response.json(artists, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
