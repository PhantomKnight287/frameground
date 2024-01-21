import { prisma } from "@repo/db";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const track = await prisma.track.findFirst({
    where: { slug: params.slug },
  });

  if (!track)
    return Response.json({ message: "track not found" }, { status: 404 });
  return Response.json({
    $schema: "../track.schema.json",
    description: track.description,
    logo: track.logo,
    name: track.name,
    status: track.status,
    folderName: track.slug,
  });
}
