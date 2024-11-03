import { useState } from "react";
import { clsx } from "clsx";
import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";

import { Panel } from "./Components/Panel";
import { ClickWheeler } from "./Components/ClickWheeler";
import { type TreeNode } from "./model";

// TODO: fix this
const demo: TreeNode = {
  name: "To Pimp a Butterfly",
  children: [
    {
      name: "Wesley's Theory (featuring George Clinton and Thundercat)",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "For Free? (Interlude)",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "King Kunta",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "Institutionalized (featuring Bilal, Anna Wise and Snoop Dogg)",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "These Walls (featuring Bilal, Anna Wise and Thundercat)",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "U",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "Alright",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "For Sale? (Interlude)",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "Momma",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "Hood Politics",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "How Much a Dollar Cost (featuring James Fauntleroy and Ronald Isley)",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "Complexion (A Zulu Love) (featuring Rapsody)",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "The Blacker the Berry",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "You Ain't Gotta Lie (Momma Said)",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "I",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
    {
      name: "Mortal Man",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    },
  ],
};

// TODO: fix this
const topMenu: TreeNode = {
  name: "Top Menu",
  children: [{ name: "Demo", children: [demo] }, { name: "Scan" }],
};

export const App: React.FC<unknown> = () => {
  // TODO: Move to a hook.
  const [contents, setContents] = useState<TreeNode>(topMenu);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onRotate = (e: ClickWheelerRotateEvent) => {
    if (!contents.children) {
      return;
    }

    const lastIndex = contents.children.length - 1;
    const nextIndex = Math.min(
      lastIndex,
      Math.max(0, selectedIndex + (e.detail.direction === "clockwise" ? 1 : -1)),
    );
    setSelectedIndex(nextIndex);
  };

  const onTap = (e: ClickWheelerTapEvent) => {
    const name = contents.children?.at(selectedIndex)?.name || "";
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
          contents={topMenu}
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
