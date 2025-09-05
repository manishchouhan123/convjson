import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

export default defineConfig({
  plugins: [
    react(),
    obfuscatorPlugin({
      options: {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        selfDefending: true,
        stringArray: true,
        stringArrayEncoding: ["base64"],
        disableConsoleOutput: true,
        // Add additional options for max obfuscation here...
      },
      // Optionally limit files: return true for all JS chunks
      matchFile: (path) => path.endsWith(".js"),
    }),
  ],
  build: {
    sourcemap: false, // 🚫 don’t expose source code
    minify: "terser"
  },
});
