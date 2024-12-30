import { useContext } from "react";
import { clsx } from "clsx";
import { type HTMLClickWheelerElement } from "click-wheeler";

import { NavigationPanelView } from "./PanelViews/NavigationPanelView";
import { PlaybackPanelView } from "./PanelViews/PlaybackPanelView";
import { topContext } from "../Modules/context";

interface PanelProps {
  className?: string;
  clickWheelerRef: React.RefObject<HTMLClickWheelerElement>;
}

export const Panel: React.FC<PanelProps> = ({ className, clickWheelerRef }) => {
  const { panelViewType } = useContext(topContext);
  const viewType = panelViewType.view;

  return (
    <div className={clsx(className, "bg-white", "border-2", "rounded-md", "border-gray-600")}>
      {viewType === "navigation" && <NavigationPanelView clickWheelerRef={clickWheelerRef} />}
      {viewType === "playback" && <PlaybackPanelView clickWheelerRef={clickWheelerRef} />}
    </div>
  );
};
