import { clsx } from "clsx"

import { Panel } from "./Components/Panel"
import {ClickWheeler } from "./Components/ClickWheeler"

export const App: React.FC<unknown> = () => {
  return (
    <main className={clsx(
      "w-screen", "h-screen",
      "flex", "justify-center", "items-center",
    )}>
      <div
        className={clsx(
          "flex", "flex-col",
          "w-80", "h-128",
          "rounded-2xl", "p-4",
          "bg-gradient-to-b", "from-slate-200", "to-zinc-200",
          "shadow-2xl"
        )}
      >
        <Panel className={clsx(
          "h-45p"
        )} />
        <ClickWheeler size={220} className={clsx(
          "flex-grow"
        )} />
      </div>
    </main>
  )
}
