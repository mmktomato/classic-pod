import { useState } from "react";
import { clsx } from "clsx";
import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";

import { Panel } from "./Components/Panel";
import { ClickWheeler } from "./Components/ClickWheeler";
import { type Song, AlbumNode, ArtistNode, DisplayNode } from "./model";
import { useDirectoryBrowse } from "./hooks";
import { createMusicLibrary } from "./Modules/library";

// TODO: fix this
const songs: Song[] = [
  {
    name: "Wesley's Theory (featuring George Clinton and Thundercat)",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "For Free? (Interlude)",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "King Kunta",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "Institutionalized (featuring Bilal, Anna Wise and Snoop Dogg)",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "These Walls (featuring Bilal, Anna Wise and Thundercat)",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "U",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "Alright",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "For Sale? (Interlude)",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "Momma",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "Hood Politics",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "How Much a Dollar Cost (featuring James Fauntleroy and Ronald Isley)",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "Complexion (A Zulu Love) (featuring Rapsody)",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "The Blacker the Berry",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "You Ain't Gotta Lie (Momma Said)",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "I",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
  {
    name: "Mortal Man",
    imageUri:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
    duration: 0,
  },
];
const albums: AlbumNode[] = [
  {
    name: "To Pimp a Butterfly",
    children: songs,
  },
];
const artists: ArtistNode[] = [
  {
    name: "Kendrick Lamar",
    children: albums,
  },
];
const topMenu: DisplayNode[] = [{ name: "Artists", children: artists }, { name: "Scan" }];

export const App: React.FC<unknown> = () => {
  // TODO: Move to a hook.
  const [contents, setContents] = useState<DisplayNode[]>(topMenu);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const { isShowDirectoryPickerSupported, browseDirectory } = useDirectoryBrowse();

  const onRotate = (e: ClickWheelerRotateEvent) => {
    if (!contents.length) {
      return;
    }
    const lastIndex = contents.length - 1;
    const nextIndex = Math.min(
      lastIndex,
      Math.max(0, selectedIndex + (e.detail.direction === "clockwise" ? 1 : -1)),
    );
    setSelectedIndex(nextIndex);
  };

  const onTap = (e: ClickWheelerTapEvent) => {
    // TODO: fix this
    const selectedItem = contents[selectedIndex];
    switch (selectedItem.name) {
      case "Artists":
      case "Kendrick Lamar":
      case "To Pimp a Butterfly":
        setContents(selectedItem.children || []);
        setSelectedIndex(0);
        return;
      case "Scan":
        if (!isShowDirectoryPickerSupported) {
          // TODO: fallback to <input type="file" webkitdirectory />.
          alert("Directory picker is not supported.");
          return;
        }
        browseDirectory().then(async handle => {
          if (handle) {
            const lib = await createMusicLibrary(handle);
            console.log(lib);
            alert(`${handle.name}, see console for details.`);
          }
        });
        return;
    }
    const name = selectedItem?.name || "";
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
