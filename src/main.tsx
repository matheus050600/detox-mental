import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ativar debug de streaks no console (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  import("./utils/streakDebug");
}

createRoot(document.getElementById("root")!).render(<App />);
