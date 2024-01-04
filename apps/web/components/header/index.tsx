import Link from "next/link";
import { IoEarth } from "react-icons/io5";

import InteractiveHeaderComponents from "./index.client";
export default function Header() {
  return (
    <header className="flex mt-5 mb-14">
      <div className="container flex flex-row">
        <div className="flex flex-row items-center">
          <IoEarth size={30} />
          <div className="font-bold leading-3 ml-1">
            Web
            <br />
            <div className="h-1 w-1"></div>
            Hero
          </div>
        </div>
        <nav className="ml-6 items-center justify-center flex flex-row">
          <Link
            href="/tracks"
            className="font-semibold hover:text-gray-400 transition-all duration-100"
          >
            Explore
          </Link>
        </nav>
        <div className="flex flex-row ml-auto">
          <InteractiveHeaderComponents />
        </div>
      </div>
    </header>
  );
}
