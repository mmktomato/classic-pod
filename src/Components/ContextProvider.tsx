import { useReducer } from "react";
import { topContext, topDispatchContext, initialState, reducer } from "../Modules/context";

export const TopContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <topContext.Provider value={state}>
      <topDispatchContext.Provider value={dispatch}>{children}</topDispatchContext.Provider>
    </topContext.Provider>
  );
};
