import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://kilwater.com",
  adapter: node({ mode: "standalone" }),
  server: { port: 4520 },
  devToolbar: { enabled: false },
  i18n: {
    defaultLocale: "pl",
    locales: ["pl", "en"],
    routing: { prefixDefaultLocale: false },
  },
});
