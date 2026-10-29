import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const LIVE_SITE = "https://www.digitalcreativeshubltd.com";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // The preview can't run the Vercel /api functions, so forward them to the
    // live site: the preview shows real data. Dev server only.
    proxy: {
      "/api": {
        target: LIVE_SITE,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "",
        headers: { Origin: LIVE_SITE, Referer: `${LIVE_SITE}/admin` },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
