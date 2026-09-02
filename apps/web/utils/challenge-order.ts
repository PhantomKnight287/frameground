/**
 * Curriculum ordering for the challenges of a track.
 *
 * Neither of the obvious sort keys works on its own. `createdAt` is the order
 * the rows happened to be written by the seed script, which is alphabetical by
 * folder name. `difficulty` is a rating, not a sequence - React's
 * `rendering-lists` is tagged `beginner` but depends on `state`, which is
 * `easy`, so sorting by it alone puts a challenge before its own prerequisite.
 *
 * The sequence the author actually intended is the `prerequisites` graph. A
 * challenge is placed at its **depth**: the length of the longest prerequisite
 * chain leading to it. Everything with no prerequisites comes first, and a
 * challenge always appears after every challenge it depends on.
 */

const DIFFICULTY_ORDER = ["beginner", "easy", "medium", "hard", "extreme"];

type Orderable = {
  slug: string;
  difficulty: string;
  prerequisites: string[];
  createdAt: string;
};

/**
 * Prerequisites are stored as `<track>/<slug>` paths, so they can point at
 * another track. Only edges inside the set being sorted can position anything,
 * so anything else is ignored.
 */
function buildGraph<T extends Orderable>(challenges: T[]) {
  const bySlug = new Map(challenges.map((challenge) => [challenge.slug, challenge]));

  return new Map(
    challenges.map((challenge) => [
      challenge.slug,
      (challenge.prerequisites ?? [])
        .map((prerequisite) => prerequisite.split("/").pop()!)
        .filter((slug) => slug !== challenge.slug && bySlug.has(slug)),
    ])
  );
}

/**
 * Longest path to each node, memoised. `visiting` guards against a cycle in
 * hand-written prerequisites: a back edge contributes no depth rather than
 * recursing forever.
 */
function depths(graph: Map<string, string[]>) {
  const cache = new Map<string, number>();

  const depthOf = (slug: string, visiting: Set<string>): number => {
    const cached = cache.get(slug);
    if (cached !== undefined) return cached;
    if (visiting.has(slug)) return 0;

    visiting.add(slug);
    const prerequisites = graph.get(slug) ?? [];
    const depth = prerequisites.length
      ? 1 + Math.max(...prerequisites.map((p) => depthOf(p, visiting)))
      : 0;
    visiting.delete(slug);

    cache.set(slug, depth);
    return depth;
  };

  for (const slug of graph.keys()) depthOf(slug, new Set());
  return cache;
}

/**
 * Sorts challenges into the order they are meant to be worked through: by
 * prerequisite depth, then by difficulty, then by age so that the order within
 * a level stays stable as challenges are added.
 */
export function sortByCurriculum<T extends Orderable>(challenges: T[]): T[] {
  const depth = depths(buildGraph(challenges));

  const rank = (challenge: T) => {
    const difficulty = DIFFICULTY_ORDER.indexOf(challenge.difficulty);
    // an unrecognised difficulty sorts after the known ones
    return difficulty === -1 ? DIFFICULTY_ORDER.length : difficulty;
  };

  return [...challenges].sort(
    (a, b) =>
      (depth.get(a.slug) ?? 0) - (depth.get(b.slug) ?? 0) ||
      rank(a) - rank(b) ||
      a.createdAt.localeCompare(b.createdAt) ||
      a.slug.localeCompare(b.slug)
  );
}
