import { Challenge, Solves, User } from "@repo/db/types";

export type SolvedChallenge = Solves & { challenge: Challenge; user: User };
