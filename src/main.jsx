import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');

      // Periodic Background Sync (Chrome Android)
      if ('periodicSync' in reg) {
        const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
        if (status.state === 'granted') {
          await reg.periodicSync.register('kkt-check-expiring', { minInterval: 12 * 60 * 60 * 1000 });
        }
      }
    } catch (e) {
      console.error('SW registration failed:', e);
    }
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
