import { useRef, useState, useEffect } from "react";
import { clsx } from "clsx";

import { type NavigationNode } from "../model";

interface ListBoxProps {
  navigation: NavigationNode[];
  selectedIndex: number;
}

export const ListBox: React.FC<ListBoxProps> = ({ navigation, selectedIndex }) => {
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
        {navigation.map((navigationNode, i) => (
          <li
            key={i}
            className={clsx("whitespace-nowrap", "pl-1", {
              "bg-blue-500": i === selectedIndex,
              "text-white": i === selectedIndex,
            })}
          >
            {navigationNode.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
