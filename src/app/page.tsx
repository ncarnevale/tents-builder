// Will automatically reroute to most recent grid from archive via sidebar

import type { Metadata } from "next";
import PlaceHolderGrid from "./components/PlaceholderGrid";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <PlaceHolderGrid showLoader />;
}
