import Link from "next/link"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {Check} from "lucide-react";
import {siteMetadataConfig} from "@repo/config";

export const metadata = {
    title: "Pricing",
    description: "Explore different plans of FrameGround",
    openGraph: {
        title: "Pricing",
        description: "Explore different plans of FrameGround",
    },
    twitter: siteMetadataConfig.twitter

}

export default function PricingPage() {
    return (
        <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
            <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
                <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                    Simple, transparent pricing
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Unlock all features
                </p>
            </div>
            <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
                <div className="grid gap-6">
                    <h3 className="text-xl font-bold sm:text-2xl">
                        What&apos;s included in the PRO plan
                    </h3>
                    <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4"/> Enroll in Unlimited Tracks
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4"/> Solve Unlimited Challenges
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4"/> Create Unlimited Solutions
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4"/> Source Code Access
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4 text-center">
                    <div>
                        <h4 className="text-7xl font-bold">$0</h4>
                        <p className="text-sm font-medium text-muted-foreground">
                            Billed per minute
                        </p>
                    </div>
                    <Link href="/tracks" className={cn(buttonVariants({size: "lg"}))}>
                        Get Started
                    </Link>
                </div>
            </div>
            <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-4">
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:leading-7">
                    There is no <strong>PRO</strong> Plan. Everything is free on this platform.
                </p>
            </div>
        </section>
    )
}