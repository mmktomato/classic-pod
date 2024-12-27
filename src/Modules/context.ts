import { createContext, Dispatch } from "react";

import { ViewType, SongEntity } from "../model";
import * as ls from "./localStorage";

interface TopContext {
  scaned: boolean;
  viewType: ViewType;
  song?: SongEntity;
}

type ActionType =
  | {
      type: "scaned";
      value: boolean;
    }
  | {
      type: "viewType";
      value: ViewType;
    }
  | {
      type: "song";
      value: SongEntity | undefined;
    };

export const initialState: TopContext = {
  viewType: "navigation",
  scaned: ls.scaned(),
};

export const topContext = createContext<TopContext>(initialState);
export const topDispatchContext = createContext<Dispatch<ActionType>>(() => {});

export const reducer = (state: TopContext, action: ActionType): TopContext => {
  switch (action.type) {
    case "scaned":
      ls.setScaned(action.value);
      return { ...state, scaned: action.value };

    case "viewType":
      if (state.viewType === action.value) {
        return state;
      }
      return { ...state, viewType: action.value };

    case "song":
      return { ...state, song: action.value };
  }
};
