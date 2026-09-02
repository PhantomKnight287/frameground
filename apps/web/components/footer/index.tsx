import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@repo/config";

const links = [
  { href: "/tracks", label: "Tracks" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
];

export default function Footer() {
  return (
    <footer className="border-t py-8 text-sm">
      <div className="container flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{siteConfig.name}</span>
          <span className="text-muted-foreground">
            © {new Date().getFullYear()} - made by PhantomKnight287
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a
            target="_blank"
            rel="noreferrer"
            className="group text-muted-foreground transition-colors hover:text-foreground"
            href={siteConfig.urls.github}
          >
            <span className="sr-only">FrameGround on GitHub</span>
            <FaGithub
              className="size-5 duration-150 group-hover:scale-110"
              aria-hidden="true"
            />
          </a>
        </nav>
      </div>
    </footer>
  );
}
