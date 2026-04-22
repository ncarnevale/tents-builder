import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/SideBar";
import NavTabs from "./components/NavTabs";
import Instructions from "./components/Instructions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tents",
  description: "A player & builder for the tents puzzle game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
            <div>
              {children}
              <div className="pl-4 pt-4 mt-4 border-gray-50/25">
                <Instructions />
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
