import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SideBar from "./components/SideBar";
import NavTabs from "./components/NavTabs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://tentsandtrees.cool";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tents and Trees: Play & Build",
    template: "%s | Tents and Trees",
  },
  description:
    "Play and build Tents aka Tents and Trees logic puzzles online. Try a puzzle from the archive or design your own grid and share it to the archive or privately with a friend.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Tents and Trees",
    title: "Tents and Trees: play & build logic puzzles",
    description:
      "Play and build Tents and Trees logic puzzles in your browser at tentsandtrees.cool.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tents and Trees: play & build logic puzzles",
    description:
      "Play and build Tents and Trees logic puzzles in your browser at tentsandtrees.cool.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <main className="p-6">
            <div className="flex justify-between mb-4">
              <h1 className="text-5xl font-bold">Tents!</h1>
              <NavTabs />
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:min-w-50 border-t md:border-t-0 md:border-r border-gray-50/25 pt-4 pl-4 md:pl-0 mt-4 md:mr-2 order-last md:order-first">
                <SideBar />
              </div>
              <div className="flex-1">{children}</div>
            </div>
          </main>
        </body>
      </html>
      <Analytics />
    </>
  );
}
