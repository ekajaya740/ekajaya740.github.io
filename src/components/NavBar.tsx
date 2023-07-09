"use client";

import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
import NavBarItem from "./NavBarItem";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import GlowingCircles from "./GlowingCircles";
import { useScrollSpy } from "@raddix/use-scroll-spy";
// TODO: Change Image to Netural Logo

const Navbar = () => {
  const pathname = usePathname();
  const activeIndex = useScrollSpy(["about", "skills"], { threshold: 0.7 });

  return (
    <nav className="w-full py-6 container mx-auto border-b bg-black">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-1 justify-items-center place-items-center">
          {pathname === "/" ? (
            <a className="z-10 col-start-1 row-start-1" href={"#about"}>
              <Image
                src="/brand_only_white.png"
                width={60}
                height={60}
                alt="logo"
              />
            </a>
          ) : (
            <Link href={"/"} className="z-10 col-start-1 row-start-1">
              <Image
                src="/brand_only_white.png"
                width={60}
                height={60}
                alt="logo"
              />
            </Link>
          )}
          {pathname === "/" ? (
            <GlowingCircles hidden={activeIndex === "about" ? false : true} />
          ) : (
            <GlowingCircles hidden={false} />
          )}
        </div>
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
                <a href={"#skills"}>
                  <NavBarItem
                    name={"Skills"}
                    selected={activeIndex === "skills"}
                  />
                </a>
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
