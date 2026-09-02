import { Hero } from "@/components/hero";
import Footer from "@/components/footer";
import { FeaturedTracks } from "./_components/featured-tracks";
import { HowItWorks } from "./_components/how-it-works";
import { Features } from "./_components/features";
import { CallToAction } from "./_components/cta";

// Statically rendered; the track list and counters refresh on their own caches.
export const revalidate = 900;

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <FeaturedTracks />
        <HowItWorks />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
