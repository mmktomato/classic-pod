import { clsx } from "clsx";

import { type ViewType, type NavigationNode, type SongEntity } from "../model";
import { NavigationPanelView } from "./PanelViews/NavigationPanelView";
import { PlaybackPanelView } from "./PanelViews/PlaybackPanelView";

interface PanelProps {
  type: ViewType;
  className?: string;
  navigation: NavigationNode[];
  selectedIndex: number;
  song?: SongEntity;
}

export const Panel: React.FC<PanelProps> = ({
  type,
  className,
  navigation,
  selectedIndex,
  song,
}) => {
  return (
    <div className={clsx(className, "bg-white", "border-2", "rounded-md", "border-gray-600")}>
      <PanelContent
        type={type}
        navigation={navigation}
        selectedIndex={selectedIndex}
        song={song}
      />
    </div>
  );
};

const PanelContent: React.FC<Omit<PanelProps, "className">> = ({
  type,
  navigation,
  selectedIndex,
  song,
}) => {
  if (type === "navigation") {
    return (
      <NavigationPanelView
        navigation={navigation}
        selectedIndex={selectedIndex}
      />
    );
  }
  if (type === "playback" && !!song) {
    return <PlaybackPanelView song={song} />;
  }
  return null;
};
