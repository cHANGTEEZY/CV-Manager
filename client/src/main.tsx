import "./assets/styles/global.css";
import "./index.css";

import { StrictMode } from "react";
import { router } from "./routes/Routes";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { DndContext } from "@dnd-kit/core";

import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DndContext>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </AuthProvider>
      </DndContext>
    </ThemeProvider>
  </StrictMode>,
);
