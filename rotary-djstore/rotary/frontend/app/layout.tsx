import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Rotary — Gear for the booth",
  description: "Turntables, mixers, controllers, headphones, and vinyl for working DJs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-body antialiased">
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
