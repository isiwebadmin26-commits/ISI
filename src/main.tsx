import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { errorHandler } from "./utils/errorHandler";

// Setup global error handling
errorHandler.setupGlobalErrorHandling();

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(<App />);

  // Only log in development
  if (import.meta.env.DEV) {
    console.log("App mounted successfully");
  }
} catch (error) {
  errorHandler.logError(error instanceof Error ? error : String(error), 'critical');

  const errorMessage = import.meta.env.DEV && error instanceof Error
    ? error.message
    : 'Application failed to start. Please refresh the page.';

  const container = document.createElement("div");
  container.style.cssText = "padding: 2rem; color: #ef4444; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;";

  const heading = document.createElement("h1");
  heading.style.cssText = "font-size: 2rem; font-weight: bold; margin-bottom: 1rem;";
  heading.textContent = "Application Failed to Start";

  const errorBox = document.createElement("div");
  errorBox.style.cssText = "background: #fef2f2; border: 1px solid #fecaca; padding: 1.5rem; border-radius: 0.5rem; overflow-x: auto;";

  const label = document.createElement("p");
  label.style.cssText = "font-weight: 600; margin-bottom: 0.5rem;";
  label.textContent = "Error Details:";

  const pre = document.createElement("pre");
  pre.style.cssText = "font-size: 0.875rem; white-space: pre-wrap;";
  pre.textContent = errorMessage;

  errorBox.appendChild(label);
  errorBox.appendChild(pre);

  if (import.meta.env.DEV && error instanceof Error && error.stack) {
    const stackPre = document.createElement("pre");
    stackPre.style.cssText = "font-size: 0.75rem; margin-top: 1rem; color: #991b1b;";
    stackPre.textContent = error.stack;
    errorBox.appendChild(stackPre);
  }

  const foot = document.createElement("p");
  foot.style.cssText = "margin-top: 1rem; color: #666;";
  foot.textContent = "Please refresh the page or contact support if the problem persists.";

  container.appendChild(heading);
  container.appendChild(errorBox);
  container.appendChild(foot);

  document.body.replaceChildren(container);
}
