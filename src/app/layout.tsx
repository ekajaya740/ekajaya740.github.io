import Navbar from "@/components/NavBar";
import "./globals.css";
import { Jost } from "next/font/google";

const jost = Jost({
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jost.className} container mx-auto`}>
        <header className="z-[9999] sticky top-0">
          <Navbar />
        </header>
        {children}
      </body>
    </html>
  );
}
