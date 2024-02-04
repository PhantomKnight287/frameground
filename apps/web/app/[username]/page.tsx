import { getCacheUser } from "@/cache/user";
import { Markdown } from "@/components/markdown";
import { env } from "@/env.mjs";
import { siteMetadataConfig } from "@repo/config";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = decodeURIComponent(params.username).replace("@", "");
  const user = await getCacheUser(username);

  if (!user)
    return {
      title: `${username} profile`,
      description: `View profile of ${username} on FrameGround`,
    };
  const searchParams = new URLSearchParams();
  searchParams.set("name", user.name!);
  searchParams.set("username", user.username!);
  return {
    metadataBase: new URL(env.HOST),
    title: `${user.username}'s profile`,
    description: `View profile of ${user.username} on FrameGround`,
    twitter: siteMetadataConfig.twitter,
    openGraph: {
      type: "website",
      title: `${user.username}'s profile`,
      description: `View profile of ${user.username} on FrameGround`,
      url: `${env.HOST}/@${user.username}`,
      images: [
        {
          url: `${env.HOST}/api/og/user?${searchParams.toString()}`,
          width: 1200,
          height: 600,
          alt: `${user.username}'s profile`,
        },
      ],
    },
  };
}

async function ProfilePage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username).replace("@", "");
  const user = await getCacheUser(username);
  if (!user) notFound();

  return (
    <>
      <div className="flex flex-col p-6 pb-0">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Bio
        </h3>
      </div>
      <div className="p-6">
        {user.bio ? (
          <Markdown
            // eslint-disable-next-line react/no-children-prop
            children={user.bio}
          />
        ) : (
          <p className="text-muted-foreground text-center">No bio yet!</p>
        )}
      </div>
    </>
  );
}

export default ProfilePage;
