"use client";

import { useEffect, useRef, useState } from "react";

type ReadMoreHtmlProps = {
  html: string;
  collapsedHeightClassName?: string;
};

export function ReadMoreHtml({
  html,
  collapsedHeightClassName = "max-h-[240px]",
}: ReadMoreHtmlProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      setCanExpand(false);
      return;
    }

    const measure = () => {
      setCanExpand(element.scrollHeight > element.clientHeight + 8);
    };

    measure();
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [html, expanded]);

  return (
    <div>
      <div className="relative">
        <div
          ref={contentRef}
          className={expanded ? "" : `${collapsedHeightClassName} overflow-hidden`}
        >
          <div
            className="prose prose-sm max-w-none text-[#596274] [&_a]:text-[#3b6ca8]"
            dangerouslySetInnerHTML={{ __html: html || "No description provided." }}
          />
        </div>

        {!expanded && canExpand ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        ) : null}
      </div>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 text-sm font-semibold text-[#3b6ca8] hover:text-[#2b5487]"
        >
          {expanded ? "View less" : "View more"}
        </button>
      ) : null}
    </div>
  );
}
