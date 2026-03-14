import React from "react";
import ReactDOM from "react-dom/client";

import DiabetCareClinicalMockupPage from "./pages/DiabetCareClinicalMockupPage";
import "./styles.css";

if (typeof performance !== "undefined" && performance.mark) {
  performance.mark("app-boot-start");
}

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <DiabetCareClinicalMockupPage />
  </React.StrictMode>,
);

if (typeof performance !== "undefined" && performance.mark) {
  performance.mark("app-boot-end");
  performance.measure("app-boot", "app-boot-start", "app-boot-end");
}
