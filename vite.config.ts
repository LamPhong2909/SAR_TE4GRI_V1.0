import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  // Đối với Zalo Mini App, base nên là './' để đảm bảo các đường dẫn tài nguyên (assets)
  // được tạo ra là tương đối, giúp ứng dụng hoạt động đúng trong môi trường của Zalo.
  base: "./",

  // Zalo Mini App được xây dựng trên nền tảng React.
  // Việc thêm plugin cho Vue (@vitejs/plugin-vue) là không cần thiết và có thể gây ra lỗi không mong muốn.
  // Chúng ta chỉ cần giữ lại plugin cho React và tsconfigPaths.
  plugins: [react(), tsconfigPaths()],

  // Cấu hình cho Vitest (testing) không ảnh hưởng đến quá trình build deploy,
  // nên chúng ta có thể giữ nguyên nó.
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/Testing/setupTests.ts",
    exclude: [...configDefaults.exclude, "**/src/Testing/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/src/Testing/**",
        "**/src/assets/**",
        "**/src/styles/**",
      ],
    }
  },
});