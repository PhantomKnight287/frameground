import { ImageResponse } from "@vercel/og";
import { Grid } from "@/components/og/grid";

export const runtime = "edge";

export async function GET(req: Request) {
  const headers = new Headers();
  headers.set("Cache-Control", "public, max-age=86400");
  return new ImageResponse(
    (
      <div tw="bg-black h-full w-full text-white bg-cover flex flex-col px-14 py-10">
        <Grid />
        <div tw="flex flex text-center h-full w-full gap-4 justify-center">
          <div tw="flex flex-col items-center justify-center">
            <div tw="flex flex-col items-center  ml-10">
              <h1 tw="text-8xl font-bold text-center">Tracks</h1>
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
