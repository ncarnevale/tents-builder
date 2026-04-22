"use client";

import { type ComponentProps } from "react";
import { usePathname } from "next/navigation";

function TabLink(props: ComponentProps<"a">) {
  return (
    <a
      {...props}
      className={`cursor-pointer text-sm font-medium bg-blue-500/10 hover:bg-blue-700 text-white py-2 my-2 px-4 rounded ${props.className}`}
    />
  );
}

function NavTabs() {
  const pathname = usePathname();

  const isPlay = !pathname || pathname === "/" || pathname.includes("play");
  const isBuild = pathname.includes("build");

  return (
    <div>
      <TabLink className={`mx-1 ${isPlay ? "border-b-4" : ""}`} href={"/"}>
        Play
      </TabLink>
      <TabLink className={`mx-1 ${isBuild ? "border-b-4" : ""}`} href="/build">
        Build
      </TabLink>
    </div>
  );
}

export default NavTabs;
