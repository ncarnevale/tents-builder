import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build",
  description:
    "Create Tents and Trees puzzles in your browser: place trees and tents, validate with built-in rules, then share a play link. Free logic-puzzle builder at tentsandtrees.cool.",
  alternates: {
    canonical: "/build",
  },
  openGraph: {
    title: "Puzzle builder — Tents and Trees",
    description:
      "Create and validate Tents and Trees puzzles, then share a solvable play link.",
    url: "/build",
    siteName: "Tents and Trees",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Puzzle builder — Tents and Trees",
    description:
      "Create and validate Tents and Trees puzzles, then share a solvable play link.",
  },
};

export default function BuildLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
