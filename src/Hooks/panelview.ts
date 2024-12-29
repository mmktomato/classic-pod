import { useState, useEffect, useContext, useCallback } from "react";
import { type ClickWheelerRotateEvent, type ClickWheelerTapEvent } from "click-wheeler";

import {
  createTopNavigation,
  onRotate as _onRotateForNavigation,
  onTap as _onTapForNavigation,
} from "./navigation";
import { type PanelView, type NavigationNode, type SongEntity } from "../model";
import { topContext, topDispatchContext } from "../Modules/context";
import { NavigationPanelView } from "../Components/PanelViews/NavigationPanelView";
import { PlaybackPanelView } from "../Components/PanelViews/PlaybackPanelView";

export const usePanelView = () => {
  const { scaned } = useContext(topContext);
  const dispatch = useContext(topDispatchContext);
  const [viewStack, setViewStack] = useState<PanelView[]>([]);
  const currentPanelView = viewStack.at(-1);

  const pushNewNavigationPanelView = useCallback((navigation: NavigationNode[]) => {
    const navigationPanelView = createNavigationPanelView(navigation, 0);
    setViewStack(current => [...current, navigationPanelView]);
  }, []);

  const updateCurrentNavigationPanelView = useCallback(
    (navigation: NavigationNode[], selectedIndex: number) => {
      if (!currentPanelView) {
        return;
      }

      setViewStack(current => {
        if (currentPanelView.type === "navigation") {
          const newCurrent = createNavigationPanelView(navigation, selectedIndex);
          return [...current.slice(0, -1), newCurrent];
        } else {
          return current;
        }
      });
    },
    [currentPanelView],
  );

  const pushNewPlaybackPanelView = useCallback(
    (song: SongEntity) => {
      const playbackPanelView = createPlaybackPanelView();
      dispatch({ type: "song", value: song });
      setViewStack(current => [...current, playbackPanelView]);
    },
    [dispatch],
  );

  const popPanelView = useCallback(() => {
    if (1 < viewStack.length) {
      setViewStack(current => current.slice(0, -1));
    }
  }, [viewStack]);

  const onRotate = useCallback(
    (e: ClickWheelerRotateEvent) => {
      if (!currentPanelView) {
        return;
      }

      if (currentPanelView.type === "navigation") {
        const { navigation, selectedIndex } = currentPanelView.props as React.ComponentProps<
          typeof NavigationPanelView
        >;
        const nextIndex = _onRotateForNavigation(e, navigation, selectedIndex);
        if (selectedIndex !== nextIndex) {
          updateCurrentNavigationPanelView(navigation, nextIndex);
        }
      }
    },
    [updateCurrentNavigationPanelView, currentPanelView],
  );

  const onTap = useCallback(
    (e: ClickWheelerTapEvent) => {
      if (!currentPanelView) {
        return;
      }

      switch (e.detail.tapArea) {
        case "center":
          if (currentPanelView.type === "navigation") {
            const { navigation, selectedIndex } = currentPanelView.props as React.ComponentProps<
              typeof NavigationPanelView
            >;
            _onTapForNavigation(navigation, selectedIndex);
          }
          break;

        case "menu":
          popPanelView();
          break;
      }
    },
    [currentPanelView, popPanelView],
  );

  useEffect(() => {
    const topNavigation = createTopNavigation(
      scaned,
      (scaned: boolean) => dispatch({ type: "scaned", value: scaned }),
      pushNewNavigationPanelView,
      pushNewPlaybackPanelView,
    );
    pushNewNavigationPanelView(topNavigation);
  }, [scaned, dispatch, pushNewNavigationPanelView, pushNewPlaybackPanelView]);

  return { current: currentPanelView, onRotate, onTap };
};

const createNavigationPanelView = (
  navigation: NavigationNode[],
  selectedIndex: number,
): PanelView<typeof NavigationPanelView> => {
  return {
    type: "navigation",
    Component: NavigationPanelView,
    props: {
      navigation,
      selectedIndex,
    },
  };
};

const createPlaybackPanelView = (): PanelView<typeof PlaybackPanelView> => {
  return {
    type: "playback",
    Component: PlaybackPanelView,
    props: {},
  };
};
