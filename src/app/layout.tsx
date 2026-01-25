import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cinema Web - Professional Movie Experience",
  description: "Explore the latest movies and TV shows with a premium cinematic experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen antialiased selection:bg-white/20 overflow-x-hidden`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
