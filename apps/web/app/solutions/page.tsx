import {getCachedSolutions} from "@/cache/solutions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {fromNow} from "@/utils/time";
import Link from "next/link"
import SolutionsFilter from "@/app/solutions/page.client";
import {getAllTracks} from "@/cache/tracks";
import {getAllChallenges} from "@/cache/challenge";
import {searchParamsCache} from "@/utils/seachParams";
import {Metadata} from "next";

export const dynamic = "force-dynamic"

export const metadata:Metadata = {
        title:"Solutions",
    description:"View Solutions of Challenges",
    openGraph:{
        title:"Solutions",
        description:"View Solutions of Challenges",
    }
}

export default async function Solutions({searchParams}: {
    searchParams: Record<string, string | string[] | undefined>
}) {
    console.log(searchParams)
    const {track, orderBy, challenge} = searchParamsCache.parse(searchParams)
    const solutions = await getCachedSolutions(
        track,
        challenge,
        orderBy !== "asc" && orderBy !== "desc" ? "asc" : orderBy
    )
    const tracks = await getAllTracks()
    const challenges = await getAllChallenges(track)
    return (
        <>
            <div className={"container"}>
                <h1 className={"font-semibold text-2xl mb-4"}>
                    Solutions
                </h1>
                <SolutionsFilter tracks={tracks} challenges={challenges}/>
                <Table>
                    <TableHeader>
                        <TableRow
                            className={"not-in-markdown"}>
                            <TableHead className="not-in-markdown">Title</TableHead>
                            <TableHead className={"not-in-markdown"}>Track</TableHead>
                            <TableHead className={"not-in-markdown"}>Challenge</TableHead>
                            <TableHead className="not-in-markdown">Posted</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            solutions.map(solution => (
                                <TableRow
                                    className={"not-in-markdown"}
                                    key={solution.id}
                                >
                                    <TableCell className="not-in-markdown">
                                        <Link
                                            href={`/solutions/${solution.id}`}
                                            className={"text-clamp-1 hover:underline"}>
                                            {solution.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className={"not-in-markdown"}>
                                        <Link
                                            href={`/tracks/${solution.challenge.track!.slug}`}
                                            className={"hover:underline"}
                                        >
                                            {solution.challenge.track!.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className={"not-in-markdown"}>
                                        <Link
                                            href={`/tracks/${solution.challenge.track!.slug}/challenge/${solution.challenge.slug}`}
                                            className={"hover:underline"}
                                        >
                                            {solution.challenge.label}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="not-in-markdown">
                                        {fromNow(solution.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
                    {
                        solutions.length === 0 ? (
                            <p
                                className={"text-center mt-4 text-muted-foreground"}
                            >
                                No Solutions Found
                            </p>
                        ):null
                    }

            </div>
        </>
    )
}