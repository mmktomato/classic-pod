import { useState, useCallback } from "react";
import { clsx } from "clsx";
import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";

import { Panel } from "./Components/Panel";
import { ClickWheeler } from "./Components/ClickWheeler";
import { useNavigation } from "./hooks";
import { type ViewType, type SongEntity } from "./model";

export const App: React.FC<unknown> = () => {
  // TODO: Move to a hook.
  const [viewType, setViewType] = useState<ViewType>("navigation");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [song, setSong] = useState<SongEntity | undefined>(undefined);
  const onSongSelected = useCallback(
    (song: SongEntity) => {
      setViewType("playback");
      setSong(song);
    },
    [setViewType, setSong],
  );

  const { navigation } = useNavigation(onSongSelected);

  const onRotate = (e: ClickWheelerRotateEvent) => {
    if (!navigation.length) {
      return;
    }
    const lastIndex = navigation.length - 1;
    const nextIndex = Math.min(
      lastIndex,
      Math.max(0, selectedIndex + (e.detail.direction === "clockwise" ? 1 : -1)),
    );
    setSelectedIndex(nextIndex);
  };

  const onTap = (e: ClickWheelerTapEvent) => {
    console.log(e.detail.type, e.detail.tapArea);

    const selectedNode = navigation.at(selectedIndex);
    selectedNode?.command();
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
          type={viewType}
          className={clsx("h-45p")}
          navigation={navigation}
          selectedIndex={selectedIndex}
          song={song}
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
