import { User } from "lucide-react";
import Link from "next/link";
import { IoEarth } from "react-icons/io5";
export default function Header() {
  return (
    <header className="flex mt-5">
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
        <nav className="ml-6">
          <Link
            href="/explore"
            className="font-semibold hover:text-gray-400 transition-all duration-[110ms]"
          >
            Explore
          </Link>
        </nav>
        <div className="flex flex-row ml-auto">
          <User />
        </div>
      </div>
    </header>
  );
}
