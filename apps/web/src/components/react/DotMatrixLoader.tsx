"use client";

import { useEffect, useState } from "react";
import { DotmSquare11 } from "@woe/ui";

export function DotMatrixLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function handleLoaded() {
      setTimeout(() => {
        setVisible(false);
      }, 800);
    }

    if (document.readyState === "complete") {
      handleLoaded();
    } else {
      window.addEventListener("load", handleLoaded, { once: true });
    }

    return () => {
      window.removeEventListener("load", handleLoaded);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        document.documentElement.classList.remove("loading");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#141414",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
        transition: "opacity 500ms ease-out",
      }}
    >
      <DotmSquare11
        size={48}
        dotSize={6}
        speed={1.2}
        bloom
        color="#dd0303"
      />
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
        }}
      >
        Loading...
      </span>
    </div>
  );
}

export default DotMatrixLoader;
