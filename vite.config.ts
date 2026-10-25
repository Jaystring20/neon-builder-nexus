import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { apiMock } from "./vite/api-mock";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // apiMock: the preview can't run the Vercel /api serverless functions, so it
  // answers them with sample data (dev only). See vite/api-mock.ts.
  plugins: [react(), mode === "development" && componentTagger(), apiMock()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
