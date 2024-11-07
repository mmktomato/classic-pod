import { useRef, useState, useEffect } from "react";
import { clsx } from "clsx";

import { type DisplayNode } from "../model";

interface ListBoxProps {
  treeNodes: DisplayNode[];
  selectedIndex: number;
}

export const ListBox: React.FC<ListBoxProps> = ({ treeNodes, selectedIndex }) => {
  const [prevSelectedIndex, setPrevSelectedIndex] = useState(selectedIndex);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (selectedIndex !== prevSelectedIndex) {
      ref.current?.children[selectedIndex]?.scrollIntoView({
        block: "nearest",
      });
      setPrevSelectedIndex(selectedIndex);
    }
  }, [selectedIndex, prevSelectedIndex]);

  return (
    <div className={clsx("h-full", "flex", "flex-col", "text-xs")}>
      {/* TODO: Album name isn't here.
      <div className={clsx("bg-slate-200")}>{treeNode.name}</div>
      */}
      <ul
        className={clsx("min-h-0", "overflow-y-scroll", "overflow-x-hidden")}
        ref={ref}
      >
        {treeNodes.map((treeNode, i) => (
          <li
            key={i}
            className={clsx("whitespace-nowrap", "pl-1", {
              "bg-blue-500": i === selectedIndex,
              "text-white": i === selectedIndex,
            })}
          >
            {treeNode.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
