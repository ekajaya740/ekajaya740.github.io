"use client";

import Image from "next/image";
import Typewriter from "typewriter-effect";
import GreetingsText from "./components/GreetingsText";

export default function AboutSection() {
  const whoAmI = [
    "A Fullstack Web Developer",
    "A Cross-Platform Apps Developer",
  ];
  return (
    <section
      id="about"
      className={
        "scroll-mt-28 container mx-auto flex w-full py-16 justify-between items-center"
      }
    >
      <Image
        src={"/me.png"}
        alt={"A figure of myself in png :3"}
        width={450}
        height={450}
        className={"-z-10 object-cover"}
      />
      <div className="flex flex-col justify-center w-full space-y-3 items-center">
        {/* @ts-expect-error Server Component */}
        <GreetingsText />
        <h1 className="text-center font-bold text-4xl col-start-1 ">
          I Putu Ekajaya Awidya Putra
        </h1>
        <Typewriter
          options={{
            cursorClassName: "text-4xl",
            wrapperClassName: "font-medium text-5xl text-center",
            strings: whoAmI,
            autoStart: true,
            loop: true,
          }}
        />
      </div>
    </section>
  );
}
