import { siteConfig } from "@repo/config";
import { IoEarth } from "react-icons/io5";
import InteractiveHeaderComponents from "./index.client";

function Header() {
  return (
    <header className="flex mt-5 mb-14">
      <div className="container flex flex-row">
        <div className="flex flex-row items-center">
          <IoEarth size={30} />
          <div className="font-semibold leading-3 ml-1">
            {siteConfig.name.split(" ")[0]}
            <br />
            <div className="h-1 w-1"></div>
            {siteConfig.name.split(" ")[1]}
          </div>
        </div>
        <div className="flex flex-row ml-auto">
          <InteractiveHeaderComponents />
        </div>
      </div>
    </header>
  );
}

export default Header;
