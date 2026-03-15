import React from "react";
import ReactDOM from "react-dom/client";

import DiabetCareClinicalMockupPage from "./pages/DiabetCareClinicalMockupPage";
import PatientShowcasePage from "./pages/PatientShowcasePage";
import "./styles.css";

/** Point d’entrée unique : page maquette multi-rôles (patient/clinicien) ou showcase patient selon ?showcase=patient */
if (typeof performance !== "undefined" && performance.mark) {
  performance.mark("app-boot-start");
}

const root = document.getElementById("root")!;
const searchParams = new URLSearchParams(window.location.search);
const isPatientShowcase = searchParams.get("showcase") === "patient";
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {isPatientShowcase ? <PatientShowcasePage /> : <DiabetCareClinicalMockupPage />}
  </React.StrictMode>,
);

if (typeof performance !== "undefined" && performance.mark) {
  performance.mark("app-boot-end");
  performance.measure("app-boot", "app-boot-start", "app-boot-end");
}
