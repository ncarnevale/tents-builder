"use client";

import { type ComponentProps, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import getGrids from "../services/getGrids";
import { TypePartialGrid } from "../types";

function ArchiveLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`cursor-pointer text-xs font-medium hover:text-blue-700 text-white my-2 ${props.className}`}
    />
  );
}

function formatGridLabel(createdAt: Date, author: string): string {
  const formatted = createdAt.toLocaleDateString("en-US", {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  });
  return `${formatted} by ${author}`;
}

function SideBar() {
  const [archiveGrids, setArchivedGrids] = useState<TypePartialGrid[]>([]);

  const { id: selectedGridId } = useParams() as { id?: string };
  const pathname = usePathname();
  const router = useRouter();

  const loadPublicGrids = async () => {
    const grids = await getGrids();
    const sortedGrids = grids.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    setArchivedGrids(sortedGrids);
  };

  useEffect(() => {
    loadPublicGrids();
  }, []);

  useEffect(() => {
    if (!pathname || (pathname === "/" && archiveGrids.length)) {
      router.push(`/play/${archiveGrids[0].id}`);
    }
  });

  return (
    <div className="pr-2">
      <div className="mb-2 text-sm">
        <b>Archive</b>
      </div>
      {archiveGrids.map(({ id, author, createdAt }) => (
        <div key={id}>
          <ArchiveLink
            href={`/play/${id}`}
            className={`${id === selectedGridId ? "border-b-2" : ""}`}
          >
            {formatGridLabel(createdAt, author)}
          </ArchiveLink>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
