import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { fib } from "virtual:fib";
import { ENV } from "virtual:env";

console.log(fib(10));
console.log(ENV.MODE);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
