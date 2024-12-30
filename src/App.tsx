import { useContext, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { type HTMLClickWheelerElement } from "click-wheeler";

import { Panel } from "./Components/Panel";
import { ClickWheeler } from "./Components/ClickWheeler";
import { topContext } from "./Modules/context";
import { openDb } from "./Modules/db";

export const App: React.FC<unknown> = () => {
  const { scaned } = useContext(topContext);
  const clickWheelerRef = useRef<HTMLClickWheelerElement>(null);

  useEffect(() => {
    if (scaned) {
      // await openDb();
      openDb();
    }
  }, [scaned]);

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
          clickWheelerRef={clickWheelerRef}
        />
        <ClickWheeler
          size={240}
          className={"flex-grow"}
          clickWheelerRef={clickWheelerRef}
        />
      </div>
    </main>
  );
};
