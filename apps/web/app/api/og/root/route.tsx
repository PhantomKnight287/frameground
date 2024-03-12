import {ImageResponse} from "@vercel/og";
import {loadGoogleFont} from "@/utils/fonts"


export async function GET() {
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=86400");
    const heading = "Learn Javascript frameworks with interactive challenges"
    const fontData = await loadGoogleFont('Inter', heading);
    return new ImageResponse(
        (
            <div tw="bg-black h-full w-full text-white flex flex-col px-14 py-10">
                <div tw="flex flex-col text-center items-start h-full w-full justify-center">
                    <h1 tw="text-left text-5xl font-bold tracking-tighter"
                        style={{fontFamily: "Inter", fontWeight: "bold"}}>
                        {heading}
                    </h1>
                    <p tw="text-gray-400 text-left">
                        Dive into React, Next.js and more. Write code, run tests, and
                        watch your progress in real time.
                    </p>
                </div>


            </div>
        ),
        {
            width: 750,
            height: 350,
            headers,
            status: 200,
            fonts: [
                {
                    name: "Inter",
                    data: fontData,
                    style: "normal",
                    weight: 800,
                }
            ]
        }
    )
}


export const runtime = "edge";
