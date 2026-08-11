import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
      "tests/**/test_*.ts",
      "tests/**/test_*.tsx"
    ],
    exclude: ["node_modules", ".next", "dist"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@domain": path.resolve(__dirname, "src/domain"),
      "@ports": path.resolve(__dirname, "src/ports"),
      "@adapters": path.resolve(__dirname, "src/adapters"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@components": path.resolve(__dirname, "src/components")
    }
  }
});
