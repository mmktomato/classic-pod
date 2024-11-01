import { useState } from "react";
import { clsx } from "clsx";
import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";

import { Panel } from "./Components/Panel";
import { ClickWheeler } from "./Components/ClickWheeler";
import { type DisplayContents } from "./model";

// TODO: fix this
const contents: DisplayContents = {
  treeNode: {
    name: "To Pimp a Butterfly",
    children: [
      "Wesley's Theory (featuring George Clinton and Thundercat)",
      "For Free? (Interlude)",
      "King Kunta",
      "Institutionalized (featuring Bilal, Anna Wise and Snoop Dogg)",
      "These Walls (featuring Bilal, Anna Wise and Thundercat)",
      "U",
      "Alright",
      "For Sale? (Interlude)",
      "Momma",
      "Hood Politics",
      "How Much a Dollar Cost (featuring James Fauntleroy and Ronald Isley)",
      "Complexion (A Zulu Love) (featuring Rapsody)",
      "The Blacker the Berry",
      "You Ain't Gotta Lie (Momma Said)",
      "I",
      "Mortal Man",
    ],
  },
  coverUri:
    "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
};

export const App: React.FC<unknown> = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onRotate = (e: ClickWheelerRotateEvent) => {
    if (!contents.treeNode.children) {
      return;
    }

    const lastIndex = contents.treeNode.children.length - 1;
    const nextIndex = Math.min(
      lastIndex,
      Math.max(0, selectedIndex + (e.detail.direction === "clockwise" ? 1 : -1)),
    );
    setSelectedIndex(nextIndex);
  };

  const onTap = (e: ClickWheelerTapEvent) => {
    const name = contents.treeNode.children ? contents.treeNode.children[selectedIndex] : "";
    const str = `${name}, ${e.detail.tapArea}, ${e.detail.type}`;
    alert(str);
  };

  return (
    <main className={clsx("w-screen", "h-screen", "flex", "justify-center", "items-center")}>
      <div
        className={clsx(
          "flex",
          "flex-col",
          "w-88",
          "h-136",
          "rounded-2xl",
          "p-4",
          "bg-gradient-to-b",
          "from-slate-200",
          "to-zinc-200",
          "shadow-2xl",
        )}
      >
        <Panel
          className={clsx("h-45p")}
          contents={contents}
          selectedIndex={selectedIndex}
        />
        <ClickWheeler
          size={240}
          className={clsx("flex-grow")}
          onRotate={onRotate}
          onTap={onTap}
        />
      </div>
    </main>
  );
};
