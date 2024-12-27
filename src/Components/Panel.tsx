import { useContext } from "react";
import { clsx } from "clsx";

import { type NavigationNode } from "../model";
import { topContext } from "../Modules/context";
import { NavigationPanelView } from "./PanelViews/NavigationPanelView";
import { PlaybackPanelView } from "./PanelViews/PlaybackPanelView";

interface PanelProps {
  className?: string;
  navigation: NavigationNode[];
  selectedIndex: number;
}

export const Panel: React.FC<PanelProps> = ({ className, navigation, selectedIndex }) => {
  return (
    <div className={clsx(className, "bg-white", "border-2", "rounded-md", "border-gray-600")}>
      <PanelContent
        navigation={navigation}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};

const PanelContent: React.FC<Omit<PanelProps, "className">> = ({ navigation, selectedIndex }) => {
  const { viewType, song } = useContext(topContext);

  if (viewType === "navigation") {
    return (
      <NavigationPanelView
        navigation={navigation}
        selectedIndex={selectedIndex}
      />
    );
  }
  if (viewType === "playback" && !!song) {
    return <PlaybackPanelView song={song} />;
  }
  return null;
};
