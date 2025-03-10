import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Update the import path for index.css
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
