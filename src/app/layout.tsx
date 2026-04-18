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
            <h1 className="text-5xl font-bold mb-4">Tents!</h1>
            <NavTabs />
          </div>
          <div className="flex">
            <div className="w-40 border-r border-gray-50/25 mr-2">
              <SideBar />
            </div>
            <div className="flex-4">
              {children}
              <div className="pl-4 mt-4">
                <Instructions />
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
