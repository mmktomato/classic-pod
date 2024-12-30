import { useContext, useCallback, useEffect } from "react";
import { type HTMLClickWheelerElement, type ClickWheelerTapEvent } from "click-wheeler";

import { topContext, topDispatchContext } from "../../Modules/context";

interface PlaybackPanelViewProps {
  clickWheelerRef: React.RefObject<HTMLClickWheelerElement>;
}

export const PlaybackPanelView: React.FC<PlaybackPanelViewProps> = ({ clickWheelerRef }) => {
  const { song } = useContext(topContext);
  const dispatch = useContext(topDispatchContext);

  const onTap = useCallback(
    (e: ClickWheelerTapEvent) => {
      switch (e.detail.tapArea) {
        case "menu":
          dispatch({ type: "panelViewType", value: { view: "navigation", navigation: "songs" } });
          break;
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const clickWheeler = clickWheelerRef.current;
    clickWheeler?.addEventListener("tap", onTap);

    return () => {
      clickWheeler?.removeEventListener("tap", onTap);
    };
  }, [clickWheelerRef, onTap]);

  if (!song) {
    return null;
  }

  return <div>{song.name}</div>;
};
