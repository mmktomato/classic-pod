import { useContext } from "react";

import { topContext } from "../../Modules/context";

export const PlaybackPanelView: React.FC<unknown> = () => {
  const { song } = useContext(topContext);

  if (!song) {
    return null;
  }

  return <div>{song.name}</div>;
};
