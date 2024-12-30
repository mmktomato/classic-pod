import { createContext, type Dispatch } from "react";

import { type PanelViewType, type SongEntity } from "../model";
import * as ls from "./localStorage";

interface TopContext {
  scaned: boolean;
  panelViewType: PanelViewType;
  song?: SongEntity;
}

type ActionType =
  | {
      type: "scaned";
      value: boolean;
    }
  | {
      type: "panelViewType";
      value: PanelViewType;
    }
  | {
      type: "song";
      value: SongEntity | undefined;
    };

export const initialState: TopContext = {
  panelViewType: { view: "navigation", navigation: "top" },
  scaned: ls.scaned(),
};

export const topContext = createContext<TopContext>(initialState);
export const topDispatchContext = createContext<Dispatch<ActionType>>(() => {});

export const reducer = (state: TopContext, action: ActionType): TopContext => {
  switch (action.type) {
    case "scaned":
      ls.setScaned(action.value);
      return { ...state, scaned: action.value };

    case "panelViewType":
      return { ...state, panelViewType: action.value };

    case "song":
      return { ...state, song: action.value };
  }
};
