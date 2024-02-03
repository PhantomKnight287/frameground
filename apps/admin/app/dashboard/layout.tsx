import Link from "next/link";
import React, { ReactNode } from "react";
const URLS = [
  {
    label: "Tracks",
    href: "tracks",
  },
  {
    label: "Reports",
    href: "reports",
  },
];

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row p-4">
      <div className="aside h-screen flex flex-col border-r-2 flex-[0.1]">
        {URLS.map((url) => (
          <Link
            href={`/dashboard/${url.href}`}
            key={url.href}
            className="p-4 hover:underline"
          >
            {url.label}
          </Link>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default DashboardLayout;
