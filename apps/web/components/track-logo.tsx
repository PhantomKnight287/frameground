import { cn } from "@/lib/utils";

/**
 * Track logos live in `public/tracks/` (vendored from svgl by
 * `scripts/add-track-logo.mjs`) and follow a fixed naming convention:
 * `<slug>.svg` for light mode and `<slug>-dark.svg` for dark mode. Only the
 * light path is stored on the track, the dark one is derived from it.
 *
 * Anything else stored in `logo` — an absolute URL from an older track — is
 * rendered as-is, in both themes.
 */
export const darkVariant = (logo: string) =>
  isVendoredLogo(logo) ? logo.replace(/\.svg$/, "-dark.svg") : logo;

export const isVendoredLogo = (logo: string) =>
  logo.startsWith("/tracks/") && logo.endsWith(".svg");

function TrackLogo({
  logo,
  name,
  className,
}: {
  logo?: string | null;
  name: string;
  className?: string;
}) {
  if (!logo) return null;

  const classes = cn("object-contain", className);

  if (!isVendoredLogo(logo)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt={`${name} logo`} className={classes} />;
  }

  return (
    <>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src={logo}
        alt={`${name} logo`}
        className={cn(classes, "dark:hidden")}
      />
      <img
        src={darkVariant(logo)}
        alt=""
        aria-hidden
        className={cn(classes, "hidden dark:block")}
      />
      {/* eslint-enable @next/next/no-img-element */}
    </>
  );
}

export default TrackLogo;
