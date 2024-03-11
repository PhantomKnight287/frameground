import Link from "next/link";
import {IoEarth} from "react-icons/io5";
import {siteConfig} from "@repo/config";

import InteractiveHeaderComponents from "./index.client";

export default function Header() {
  return (
      <header className="flex mt-5 mb-6">
        <div className="container flex flex-row">
          <Link href="/" className="flex items-center justify-center">
            <div className="flex flex-row items-center">
              <IoEarth size={30}/>
              <div className="font-semibold leading-3 ml-1">
                {siteConfig.name.split(" ")[0]}
                <br/>
                <div className="h-1 w-1"></div>
                {siteConfig.name.split(" ")[1]}
              </div>
            </div>
          </Link>
          <nav className="ml-6 hidden md:flex items-center justify-center flex-row gap-4">
            <Link
                href="/tracks"
                className="font-semibold hover:text-gray-400 transition-all duration-100"
            >
              Tracks
            </Link>
            <Link
                href="/solutions"
                className="font-semibold hover:text-gray-400 transition-all duration-100"
            >
              Solutions
            </Link>
            <Link
                href="/pricing"
                className="font-semibold hover:text-gray-400 transition-all duration-100"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex flex-row ml-auto">
            <InteractiveHeaderComponents/>
          </div>
        </div>
      </header>
  );
}