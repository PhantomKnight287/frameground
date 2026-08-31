import { prisma } from "@repo/db";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const track = await prisma.track.findFirst({
    where: { slug },
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
