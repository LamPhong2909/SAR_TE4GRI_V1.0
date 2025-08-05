import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// Giải thích : // - Đoạn code này là cấu hình cho Vite, một công cụ xây dựng ứng dụng web hiện đại.
// - Nó sử dụng các plugin để hỗ trợ TypeScript, React và Vue.
//Dùng để xử lý các đường dẫn trong tsconfig.json, giúp Vite hiểu được các alias và đường dẫn tương đối.
// Quan trọng vì nó giúp Vite tìm kiếm các module và tệp tin một cách chính xác, đặc biệt trong các dự án lớn với cấu trúc thư mục phức tạp.
//Mối quan hệ của nó với src // - Đoạn code này không trực tiếp liên quan đến thư mục src, nhưng nó sẽ ảnh hưởng đến cách Vite xử lý các tệp tin trong thư mục src.
// Rất quan trọng cho việc phát triển ứng dụng web hiện đại, giúp tối ưu hóa quá trình xây dựng và phát triển ứng dụng.

// Có quan trọng cho phát triển ứng dụng web hiện đại không? // - Có, vì nó giúp cải thiện hiệu suất, hỗ trợ các tính năng hiện đại của JavaScript và TypeScript, và cung cấp trải nghiệm phát triển tốt hơn với các plugin hỗ trợ. 
// Có quan trọng cho phát triển ứng dụng native không ? // - Không, vì Vite chủ yếu được sử dụng cho phát triển ứng dụng web, không phải ứng dụng native. Đối với ứng dụng native, thường sử dụng các công cụ khác như React Native CLI hoặc Expo.




// import vue from "@vitejs/plugin-vue";
import {configDefaults} from "vitest/config";
// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    // root: "./src",
    base: "",
    plugins: [tsconfigPaths(), react(),],
    test:{
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/Testing/setupTests.ts",
      exclude: [...configDefaults.exclude, "**/src/Testing/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "**/node_modules/**",
          "**/dist/**",
          "**/src/Testing/**",
          "**/src/pages/**",
          "**/src/components/**",
          "**/src/assets/**",
          "**/src/styles/**",
          "**/*.d.ts"
        ]
      }
    }

  });
};

//globals: true // - Thiết lập này cho phép sử dụng các biến toàn cục trong môi trường kiểm thử, như `describe`, `it`, `expect` mà không cần phải import chúng trong mỗi tệp kiểm thử.
// environment: "jsdom" // - Thiết lập này chỉ định môi trường kiểm thử là `jsdom`, cho phép mô phỏng DOM trong Node.js, rất hữu ích cho việc kiểm thử các thành phần React.
// setupFiles: "./src/Testing/setupTests.ts" // - Tệp này sẽ được chạy trước khi các tệp kiểm thử khác, thường dùng để cấu hình môi trường kiểm thử, như thiết lập enzyme hoặc các thư viện hỗ trợ khác. //Đây là 1 kỹ thuật chuyên nghiệp 

//thay đổi setupFiles: "./src/Testing/setupTests.ts"  bằng setupFiles: "./src/Testing/setupTests.js" // - Nếu muốn sử dụng JavaScript thay vì TypeScript cho tệp cấu hình này, bạn có thể đổi phần mở rộng từ `.ts` sang `.js`.


//    exclude: [...configDefaults.exclude, "**/src/Testing/**"], // - Loại trừ các tệp và thư mục không cần thiết khỏi quá trình kiểm thử, giúp giảm thời gian và tài nguyên sử dụng trong quá trình kiểm thử.
//    coverage: { // - Cấu hình này cho phép thu thập thông tin về độ bao phủ mã nguồn trong quá trình kiểm thử, giúp xác định các phần của mã nguồn chưa được kiểm thử đầy đủ.
//        provider: "v8", // - Sử dụng trình thu thập thông tin độ bao phủ mã nguồn của V8, trình biên dịch JavaScript được sử dụng trong Node.js.
//        reporter: ["text", "json", "html"], // - Chỉ định các định dạng báo cáo độ bao phủ mã nguồn, bao gồm văn bản, JSON và HTML.
//        include: ["src/**/*.{ts,tsx}"], // - Chỉ định các tệp mã nguồn cần thu thập độ bao phủ, trong trường hợp này là tất cả các tệp TypeScript và TypeScript React trong thư mục `src`.
//        exclude: [ // - Loại trừ các tệp và thư mục không cần thiết khỏi quá trình thu thập độ bao phủ, giúp tập trung vào các phần mã nguồn quan trọng.
