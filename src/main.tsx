import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { TopContextProvider } from "./Components/ContextProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TopContextProvider>
      <App />
    </TopContextProvider>
  </StrictMode>,
);
