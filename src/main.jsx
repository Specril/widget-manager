import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { PercentageProvider } from "./context/PercentageContext.jsx";

createRoot(document.getElementById("root")).render(
  <PercentageProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </PercentageProvider>
);
