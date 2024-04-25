import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import clerk from "astro-clerk-auth/hotload";
import cloudflare from "@astrojs/cloudflare";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    clerk({
      afterSignInUrl: "/",
      afterSignUpUrl: "/",
    }),
  ],
  vite: {
    plugins: [
      visualizer({
        template: "treemap",
        open: process.env.ANALYZE === "true",
        gzipSize: true,
      }),
    ],
    ssr: {
      external: ["node:async_hooks"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("clerk-js")) {
              return "@clerk-js";
            }
            if (id.includes("astro-clerk-auth")) {
              return "@astro-clerk-auth";
            }
            if (id.includes("localizations")) {
              return "@clerk-localizations";
            }
          },
        },
      },
    },
  },
  output: "server",
  adapter: cloudflare(),
});
