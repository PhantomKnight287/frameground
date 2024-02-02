import { ImageResponse } from "@vercel/og";
import { Grid } from "@/components/og/grid";
import { z } from "zod";
import { NextRequest } from "next/server";

export const runtime = "edge";

const schema = z.object({
  username: z.string(),
  name: z.string(),
});

export async function GET(req: NextRequest) {
  const parseResult = schema.safeParse({
    username: req.nextUrl.searchParams.get("username"),
    name: req.nextUrl.searchParams.get("name"),
  });
  if (parseResult.success === false)
    return new Response("Invalid params", { status: 400 });
  const headers = new Headers();
  headers.set("Cache-Control", "public, max-age=86400");
  return new ImageResponse(
    (
      <div tw="bg-black h-full w-full text-white bg-cover flex flex-col px-14 py-10">
        <Grid />
        <div tw="flex flex text-center h-full w-full gap-4 justify-center">
          <div tw="flex flex-col items-center justify-center">
            <img
              src={`https://github.com/${parseResult.data.username}.png`}
              tw="object-cover h-68 w-68 rounded-full"
              height={24}
              width={24}
            />

            <div tw="flex flex-col ml-10">
              <h1 tw="text-5xl font-bold">{parseResult.data.name}</h1>
            </div>
          </div>
        </div>
        <div tw="absolute top-2 right-2">&copy; FrameGround</div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      headers,
      status: 200,
    }
  );
}
