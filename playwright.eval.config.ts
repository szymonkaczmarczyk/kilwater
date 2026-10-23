import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/eval",
  testMatch: "*.eval.ts",
  workers: 1,
  timeout: 120_000,
  reporter: [["list"]],
});
