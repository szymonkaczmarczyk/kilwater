import { defineConfig, devices } from "@playwright/test";

const port = 4521;

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run build && node ./dist/server/entry.mjs",
    url: `http://localhost:${port}`,
    env: { PORT: String(port), HOST: "localhost", INQUIRY_DRY_RUN: "1" },
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
