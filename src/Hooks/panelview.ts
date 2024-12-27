import { useState, useEffect, useContext, useCallback } from "react";
import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";

import {
  createTopNavigation,
  onRotate as _onRotateForNavigation,
  onTap as _onTapForNavigation,
} from "./navigation";
import { type PanelView, type NavigationNode, SongEntity } from "../model";
import { topContext, topDispatchContext } from "../Modules/context";
import { NavigationPanelView } from "../Components/PanelViews/NavigationPanelView";
import { PlaybackPanelView } from "../Components/PanelViews/PlaybackPanelView";

export const usePanelView = () => {
  const { viewType, scaned } = useContext(topContext);
  const dispatch = useContext(topDispatchContext);
  const [viewStack, setViewStack] = useState<PanelView[]>([]);
  const current = viewStack.at(-1);

  const pushNewNavigationPanelView = useCallback(
    (navigation: NavigationNode[]) => {
      const navigationPanelView = createNavigationPanelView(navigation, 0);
      dispatch({ type: "viewType", value: "navigation" });
      setViewStack(current => [...current, navigationPanelView]);
    },
    [dispatch],
  );

  const updateCurrentNavigationPanelView = useCallback(
    (navigation: NavigationNode[], selectedIndex: number) => {
      setViewStack(current => {
        if (viewType === "navigation") {
          const newCurrent = createNavigationPanelView(navigation, selectedIndex);
          return [...current.slice(0, -1), newCurrent];
        } else {
          return current;
        }
      });
    },
    [viewType],
  );

  const pushNewPlaybackPanelView = useCallback(
    (song: SongEntity) => {
      const playbackPanelView = createPlaybackPanelView();
      dispatch({ type: "viewType", value: "playback" });
      dispatch({ type: "song", value: song });
      setViewStack(current => [...current, playbackPanelView]);
    },
    [dispatch],
  );

  const onRotate = (e: ClickWheelerRotateEvent) => {
    if (!current) {
      return;
    }

    if (viewType === "navigation") {
      const { navigation, selectedIndex } = current.props as React.ComponentProps<
        typeof NavigationPanelView
      >;
      const nextIndex = _onRotateForNavigation(e, navigation, selectedIndex);
      updateCurrentNavigationPanelView(navigation, nextIndex);
    }
  };

  const onTap = (e: ClickWheelerTapEvent) => {
    if (!current) {
      return;
    }

    if (viewType === "navigation") {
      const { navigation, selectedIndex } = current.props as React.ComponentProps<
        typeof NavigationPanelView
      >;
      _onTapForNavigation(e, navigation, selectedIndex);
    }
  };

  useEffect(() => {
    const topNavigation = createTopNavigation(
      scaned,
      (scaned: boolean) => dispatch({ type: "scaned", value: scaned }),
      pushNewNavigationPanelView,
      pushNewPlaybackPanelView,
    );
    pushNewNavigationPanelView(topNavigation);
  }, [scaned, dispatch, pushNewNavigationPanelView, pushNewPlaybackPanelView]);

  return { current, onRotate, onTap };
};

const createNavigationPanelView = (
  navigation: NavigationNode[],
  selectedIndex: number,
): PanelView<typeof NavigationPanelView> => {
  return {
    Component: NavigationPanelView,
    props: {
      navigation,
      selectedIndex,
    },
  };
};

const createPlaybackPanelView = () => {
  return {
    Component: PlaybackPanelView,
    props: {},
  };
};
