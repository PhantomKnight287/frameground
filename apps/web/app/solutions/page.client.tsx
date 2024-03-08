'use client';

import {useQueryState,} from 'nuqs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Track, Challenge} from "@repo/db/types";
import {upperFirst} from "@repo/utils";


export default function SolutionsFilter({tracks, challenges}: {
    tracks: Track[],
    challenges: { slug: string, label: string }[]
}) {
    const [track, setTrack] = useQueryState('track',{history:"replace",shallow:false})
    const [challenge, setChallenge] = useQueryState('challenge',{history:"replace",shallow:false})
    const [orderBy, setOrderBy] = useQueryState("orderBy",{history:"replace",shallow:false})


    return (
        <div className={"flex flex-row gap-4 w-full my-4"}>

            <Select onValueChange={setTrack} value={track || undefined}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Track"/>
                </SelectTrigger>
                <SelectContent>
                    {
                        tracks.map((track) => (
                            <SelectItem value={track.slug}
                                        key={track.slug}
                            >
                                {track.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            <Select onValueChange={setChallenge} value={challenge || undefined}>
                <SelectTrigger
                    className={"max-w-[200px]"}
                >
                    <SelectValue placeholder="Challenge"/>
                </SelectTrigger>
                <SelectContent>
                    {
                        challenges.map((challenge) => (
                            <SelectItem value={challenge.slug}
                                        key={challenge.slug}
                            >
                                {challenge.label}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            <Select onValueChange={setOrderBy} value={orderBy || undefined}>
                <SelectTrigger
                    className={"max-w-[200px]"}
                >
                    <SelectValue placeholder="Order By"/>
                </SelectTrigger>
                <SelectContent>
                    {
                        ["asc","desc"].map((option) => (
                            <SelectItem value={option}
                                        key={option}
                            >
                                {upperFirst(option)}ending
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>

        </div>
    )
}