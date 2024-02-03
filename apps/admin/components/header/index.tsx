import { siteConfig } from "@repo/config";
import { IoEarth } from "react-icons/io5";
import InteractiveHeaderComponents from "./index.client";
import Link from "next/link";

function Header() {
  return (
    <header className="flex mt-5 mb-14">
      <div className="container flex flex-row">
        <Link href="/">
          <div className="flex flex-row items-center">
            <IoEarth size={30} />
            <div className="font-semibold leading-3 ml-1">
              {siteConfig.name.split(" ")[0]}
              <br />
              <div className="h-1 w-1"></div>
              {siteConfig.name.split(" ")[1]}
            </div>
          </div>
        </Link>
        <nav className="ml-6 hidden md:flex items-center justify-center flex-row">
          <Link
            href="/dashboard"
            className="font-semibold hover:text-gray-400 transition-all duration-100"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex flex-row ml-auto">
          <InteractiveHeaderComponents />
        </div>
      </div>
    </header>
  );
}

export default Header;
