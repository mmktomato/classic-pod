import { createContext, Dispatch } from "react";

import { ViewType, SongEntity } from "../model";

type ActionType =
  | {
      type: "viewType";
      action: ViewType;
    }
  | {
      type: "song";
      action: SongEntity | undefined;
    };

interface TopContext {
  viewType: ViewType;
  song?: SongEntity;
}

export const initialState: TopContext = {
  viewType: "navigation",
};

export const topContext = createContext<TopContext>(initialState);
export const topDispatchContext = createContext<Dispatch<ActionType>>(() => {});

export const reducer = (state: TopContext, action: ActionType): TopContext => {
  switch (action.type) {
    case "viewType":
      state.viewType = action.action;
      return state;

    case "song":
      state.song = action.action;
      return state;
  }
};
