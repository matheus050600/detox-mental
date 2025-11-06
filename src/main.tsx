import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Ativar debug de streaks no console (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  import("./utils/streakDebug");
}

createRoot(document.getElementById("root")!).render(<App />);

// Registrar service worker para PWA
serviceWorkerRegistration.register({
  onSuccess: () => console.log('✅ PWA: Service Worker registrado com sucesso'),
  onUpdate: () => console.log('🔄 PWA: Nova versão disponível')
});
