"use client";

import { type ComponentProps } from "react";
import { usePathname } from "next/navigation";

type TypeTabLinkProps = ComponentProps<"a"> & {
  selected?: boolean;
};
function TabLink(props: TypeTabLinkProps) {
  const { className, selected = false, ...rest } = props;
  return (
    <a
      {...rest}
      className={`border-0 border-r-0 text-sm py-2 px-4 my-2 ${selected ? "text-tertiary border-b-2 font-bold" : "font-semibold"} ${className ?? ""}`}
    />
  );
}

function NavTabs() {
  const pathname = usePathname();

  const isPlay = !pathname || pathname === "/" || pathname.includes("play");
  const isBuild = pathname.includes("build");

  return (
    <div>
      <TabLink selected={isPlay} className="mx-1" href="/">
        Play
      </TabLink>
      <TabLink selected={isBuild} className="mx-1" href="/build">
        Build
      </TabLink>
    </div>
  );
}

export default NavTabs;
