import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/upwork-threejs-example/",
  server: {
    allowedHosts: [".csb.app"],
  },
});
