// Đây là file code tên gì ?


// Bạn có thể nào tự tìm kiếm những thông tin hay làm gì trong codebase của tôi ?
// - Yes, I can search for information or perform tasks within the codebase you provide. However, I can only work with the code snippets and context you share with me in this conversation. If you have specific questions or tasks related to your code, feel free to ask!

// src/hooks.ts
// This file contains custom hooks for handling various functionalities in a Zalo Mini App.
// src/hooks.ts
// This file is part of the Zalo Mini App project.
// It contains custom hooks for handling functionalities such as matching status text color, detecting virtual keyboard visibility, handling payments, and providing a "to be implemented" notification.
 
// File code chúng ta đang nói chuyện tên gì ??
// - src/hooks.ts 





import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { matchStatusBarColor } from "./utils/device";
import { EventName, events, Payment } from "zmp-sdk";
import { useNavigate, useSnackbar } from "zmp-ui";

export function useMatchStatusTextColor(visible?: boolean) {
  const changedRef = useRef(false);
  useEffect(() => {
    if (changedRef.current) {
      matchStatusBarColor(visible ?? false);
    } else {
      changedRef.current = true;
    }
  }, [visible]);
}

const originalScreenHeight = window.innerHeight;

export function useVirtualKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const detectKeyboardOpen = () => {
      setVisible(window.innerHeight + 160 < originalScreenHeight);
    };
    window.addEventListener("resize", detectKeyboardOpen);
    return () => {
      window.removeEventListener("resize", detectKeyboardOpen);
    };
  }, []);

  return visible;
}

export const useHandlePayment = () => {
  const navigate = useNavigate();
  useEffect(() => {
    events.on(EventName.OpenApp, (data) => {
      if (data?.path) {
        navigate(data?.path, {
          state: data,
        });
      }
    });

    events.on(EventName.OnDataCallback, (resp) => {
      const { appTransID, eventType } = resp;
      if (appTransID || eventType === "PAY_BY_CUSTOM_METHOD") {
        navigate("/result", {
          state: resp,
        });
      }
    });

    events.on(EventName.PaymentClose, (data = {}) => {
      const { zmpOrderId } = data;
      navigate("/result", {
        state: { data: { zmpOrderId } },
      });
    });
  }, []);
};

export function useToBeImplemented() {
  const snackbar = useSnackbar();
  return () =>
    snackbar.openSnackbar({
      type: "success",
      text: "Chức năng đang trong giai đoạn phát triển, hãy chờ SAR nhé !",
    });
}




//Đây là file code tên gì , ý tôi là cái file code này chúng ta đang trò chuyện ấy ?
// - src/hooks.ts
// Bạn hiểu gì về hooks.ts này của tôi ?
// - hooks.ts này chứa các hook tùy chỉnh để xử lý các chức năng khác nhau trong ứng dụng Zalo Mini App. Nó bao gồm việc khớp màu văn bản trạng thái, phát hiện sự hiển thị của bàn phím ảo, xử lý thanh toán và cung cấp thông báo "đang được triển khai". Các hook này giúp quản lý trạng thái và tương tác với người dùng một cách hiệu quả hơn trong ứng dụng.
// Hãy nêu cho tôi biết các kỹ thuật được sử dụng trong file code này chúng ta đang nói ?
// - hooks.ts này sử dụng các kỹ thuật sau:
//   1. **Custom Hooks**: Định nghĩa các hook tùy chỉnh như `useMatchStatusTextColor`, `useVirtualKeyboardVisible`, `useHandlePayment`, và `useToBeImplemented` để quản lý trạng thái và logic ứng dụng.
//   2. **Event Handling**: Sử dụng `events.on` để lắng nghe các sự kiện từ SDK Zalo Mini App, như `OpenApp`, `OnDataCallback`, và `PaymentClose`.
//   3. **State Management**: Sử dụng `useState` để quản lý trạng thái của bàn phím ảo và các thông báo.
//   4. **Effect Hook**: Sử dụng `useEffect` để thực hiện các tác vụ phụ, như lắng nghe sự kiện và cập nhật trạng thái khi có thay đổi.
//   5. **Navigation**: Sử dụng `useNavigate` từ ZMP UI để điều hướng giữa các trang trong ứng dụng.
//   6. **Snackbar Notifications**: Sử dụng `useSnackbar` để hiển thị thông báo cho người dùng khi cần thiết.
//   7. **Lodash**: Sử dụng thư viện lodash để xử lý các thao tác với mảng và đối tượng, mặc dù trong đoạn code này không thấy sử dụng cụ thể.
//   8. **TypeScript**: Sử dụng TypeScript để đảm bảo kiểu dữ liệu và an toàn khi phát triển ứng dụng.
//   9. **Responsive Design**: Phát hiện sự thay đổi kích thước của cửa sổ để xác định xem bàn phím ảo có hiển thị hay không, từ đó cập nhật giao diện người dùng một cách linh hoạt.
//   10. **Ref Hook**: Sử dụng `useRef` để giữ trạng thái của việc thay đổi màu văn bản trạng thái, giúp tránh việc cập nhật không cần thiết.
//   11. **Constants**: Sử dụng các hằng số như `EventName` từ SDK để quản lý các tên sự kiện một cách nhất quán và dễ bảo trì.
//   12. **ZMP SDK**: Sử dụng ZMP SDK để tương tác với các API của Zalo Mini App, như thanh toán và sự kiện ứng dụng.
//   13. **Error Handling**: Mặc dù không rõ ràng trong đoạn code này, nhưng việc sử dụng các hook và sự kiện có thể bao gồm xử lý lỗi để đảm bảo ứng dụng hoạt động ổn định.
//   14. **Functional Programming**: Sử dụng các hàm thuần túy và các hàm callback để xử lý logic, giúp mã nguồn dễ đọc và bảo trì hơn.
//   15. **Destructuring**: Sử dụng destructuring để lấy các thuộc tính từ đối tượng, giúp mã nguồn ngắn gọn và dễ hiểu hơn.
//   16. **Optional Chaining**: Sử dụng toán tử optional chaining (`?.`) để truy cập các thuộc tính của đối tượng một cách an toàn, tránh lỗi khi thuộc tính không tồn tại.
//   17. **Default Parameters**: Sử dụng các tham số mặc định trong hàm để đảm bảo rằng các giá trị cần thiết luôn có sẵn, ngay cả khi không được truyền vào.
//   18. **Callback Functions**: Sử dụng các hàm callback để xử lý các sự kiện và tương tác với người dùng, giúp mã nguồn linh hoạt và dễ dàng mở rộng.
//   19. **Memoization**: Mặc dù không rõ ràng trong đoạn code này, nhưng việc sử dụng các hook như `useMemo` hoặc `useCallback` có thể được áp dụng để tối ưu hóa hiệu suất khi cần thiết.
//   20. **CSS-in-JS**: Mặc dù không thấy sử dụng trong đoạn code này, nhưng ZMP UI thường hỗ trợ các giải pháp CSS-in-JS để quản lý kiểu dáng động trong ứng dụng.
//   21. **Accessibility**: Mặc dù không rõ ràng trong đoạn code này, nhưng việc sử dụng các thuộc tính ARIA và các phương pháp tiếp cận tốt có thể được áp dụng để đảm bảo ứng dụng thân thiện với người dùng khuyết tật.
//   22. **Internationalization (i18n)**: Mặc dù không thấy sử dụng trong đoạn code này, nhưng ZMP UI thường hỗ trợ các giải pháp i18n để quản lý đa ngôn ngữ trong ứng dụng.
//   23. **Performance Optimization**: Sử dụng các kỹ thuật như lazy loading, code splitting, và tối ưu hóa hiệu suất để đảm bảo ứng dụng hoạt động mượt mà trên các thiết bị khác nhau.
//   24. **Testing**: Mặc dù không thấy trong đoạn code này, nhưng việc sử dụng các công cụ kiểm thử như Jest hoặc React Testing Library có thể được áp dụng để đảm bảo chất lượng mã nguồn.
//   25. **Code Organization**: Tổ chức mã nguồn theo các module và thư mục hợp lý để dễ dàng quản lý và bảo trì, như việc tách biệt các hook, utils, và components.
//   26. **Documentation**: Viết tài liệu cho các hook và chức năng để người khác có thể hiểu và sử dụng mã nguồn một cách dễ dàng hơn.


// Bạn hiểu gì về file code này  mà tôi đã cố gắng viết (nêu tên file code này trước rồi nói gì nói )?
// - hooks.ts này chứa các hook tùy chỉnh để xử lý các chức năng khác nhau trong ứng dụng Zalo Mini App. Nó bao gồm việc khớp màu văn bản trạng thái, phát hiện sự hiển thị của bàn phím ảo, xử lý thanh toán và cung cấp thông báo "đang được triển khai". Các hook này giúp quản lý trạng thái và tương tác với người dùng một cách hiệu quả hơn trong ứng dụng.