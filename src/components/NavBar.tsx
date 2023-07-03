"use client";

import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
import NavBarItem from "./NavBarItem";
import { usePathname } from "next/navigation";
import classNames from "classnames";

// TODO: Change Image to Netural Logo

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="w-full container mx-auto border-b">
      <div className="flex justify-between items-center">
        <Link href={"/"}>
          <Image
            src="/logo/ld_tr_logo_nodetail.png"
            width={120}
            height={30}
            alt="logo"
          />
        </Link>
        <div className="flex justify-evenly items-center space-x-4">
          {pathname === "/" ? (
            <></>
          ) : (
            <Link href={"/"}>
              <NavBarItem name={"Home"} />
            </Link>
          )}
          <div
            className={classNames("bg-zinc-900 rounded-full px-4 py-1", {
              hidden: pathname !== "/",
            })}
          >
            <ul className="flex justify-between items-center space-x-3">
              <li>
                <Link href={""}>
                  <NavBarItem name={"Skills"} />
                </Link>
              </li>
              <li>
                <Link href={""}>
                  <NavBarItem name={"Experience"} />
                </Link>
              </li>
              <li>
                <Link href={""}>
                  <NavBarItem name={"Portfolio"} />
                </Link>
              </li>
            </ul>
          </div>
          <div
            className={classNames("rounded-full px-4 py-1", {
              "bg-zinc-900": pathname === "/blog",
            })}
          >
            <Link href={"/blog"}>
              <NavBarItem name={"Blog"} />
            </Link>
          </div>
        </div>
        <Button name="Contact Me!" />
      </div>
    </nav>
  );
};

export default Navbar;
