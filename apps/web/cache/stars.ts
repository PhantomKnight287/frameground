import { unstable_cache as cache } from "next/cache";
export async function getGithubStars(): Promise<number | null> {
  try {
    return await cache(
      async () => {
        const response = await fetch(
          "https://api.github.com/repos/phantomknight287/frameground",
          {
            headers: {
              Accept: "application/vnd.github+json",
            },
            next: {
              revalidate: 60,
            },
          }
        );

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { stargazers_count: number };

        return data.stargazers_count;
      },
      ["github-stars"],
      {
        revalidate: 900,
        tags: ["github-stars"],
      }
    )();
  } catch (err) {
    console.error(err);
    return null;
  }
}
