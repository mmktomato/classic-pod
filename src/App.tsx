import { useContext, useEffect } from "react";
import { clsx } from "clsx";

import { Panel } from "./Components/Panel";
import { ClickWheeler } from "./Components/ClickWheeler";
import { usePanelView } from "./Hooks/panelview";
import { topContext } from "./Modules/context";
import { openDb } from "./Modules/db";

export const App: React.FC<unknown> = () => {
  const { scaned } = useContext(topContext);
  const { current, onRotate, onTap } = usePanelView();

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
        {current && (
          <Panel
            className={clsx("h-45p")}
            panelView={current}
          />
        )}
        <ClickWheeler
          size={240}
          className={"flex-grow"}
          onRotate={onRotate}
          onTap={onTap}
        />
      </div>
    </main>
  );
};
