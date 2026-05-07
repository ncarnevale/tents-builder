import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SideBar from "./components/SideBar";
import NavTabs from "./components/NavTabs";
import { ThemeRoot } from "./components/ThemeRoot";
import { ThemeToggle } from "./components/ThemeToggle";
import Instructions from "./components/Instructions";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://tentsandtrees.cool";

const themeInitScript = `(function(){try{var k="tb-theme";var v=localStorage.getItem(k);var d;if(v==="dark")d=!0;else if(v==="light")d=!1;else d=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tents and Trees",
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
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} flex min-h-full flex-col bg-primary text-secondary antialiased`}
        >
          <Script
            id="tb-theme-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: themeInitScript }}
          />
          <ThemeRoot>
            <main className="p-6 pb-3 h-full flex flex-col">
              <div className="mb-8 flex items-center justify-between gap-4">
                <h1 className="flex-1 min-w-50 text-5xl font-extrabold">
                  Tents
                </h1>
                <div className="flex flex-1 justify-end md:justify-center">
                  <NavTabs />
                </div>
                <div className="hidden md:flex md:flex-1 md:justify-end">
                  <ThemeToggle />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:grow">
                <div className="order-last mt-4 border-t border-divider border-secondary/20 pt-4 pl-4 md:order-first md:mr-2 md:w-50 md:border-t-0 md:border-r md:pl-0">
                  <SideBar />
                </div>
                <div className="flex-1">{children}</div>
                <div className="mt-4 border-t border-divider border-secondary/20 pt-4 pl-4 md:mr-2 md:w-50 md:border-t-0 md:border-l">
                  <Instructions />
                </div>
              </div>
              <p className="pb-4 md:pb-0 md:mt-2 flex justify-end print:hidden flex-1 items-end">
                <a
                  href="mailto:hello@tentsandtrees.cool"
                  className="text-[11px] text-secondary/55 underline-offset-2 hover:text-secondary hover:underline"
                >
                  Contact me
                </a>
              </p>
            </main>
          </ThemeRoot>
        </body>
      </html>
      <Analytics />
    </>
  );
}
