import { createRoot } from "react-dom/client";

import App from "./app";

function render() {
  const root = createRoot(document.getElementById("app"));
  root.render(<App />);
}

render();
