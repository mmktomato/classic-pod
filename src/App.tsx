import { useState } from "react";
import { clsx } from "clsx";
import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";

import { Panel } from "./Components/Panel";
import { ClickWheeler } from "./Components/ClickWheeler";
import { useNavigation } from "./hooks";

export const App: React.FC<unknown> = () => {
  const { navigation } = useNavigation();

  // TODO: Move to a hook.
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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
          className={clsx("h-45p")}
          navigation={navigation}
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
