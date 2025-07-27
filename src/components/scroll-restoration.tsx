// File: src/components/scroll-restoration.tsx
// File này có chức năng gì , hãy giải thích tinh vi và toàn diện nhất ?
//- scroll-restoration.tsx là một React component được sử dụng để quản lý việc khôi phục vị trí cuộn của trang khi người dùng điều hướng giữa các trang trong ứng dụng. Nó lưu trữ vị trí cuộn của mỗi trang dựa trên đường dẫn và truy vấn, và khi người dùng quay lại trang đó, nó sẽ tự động cuộn đến vị trí đã lưu. Điều này giúp cải thiện trải nghiệm người dùng bằng cách giữ nguyên vị trí cuộn khi họ điều hướng qua lại giữa các trang.
//- Component này sử dụng hook useLocation từ React Router để theo dõi thay đổi đường dẫn và lưu trữ vị trí cuộn trong một đối tượng scrollPositions. Khi người dùng điều hướng đến một trang mới, nó sẽ kiểm tra xem có vị trí cuộn đã lưu cho trang đó hay không, và nếu có, nó sẽ cuộn đến vị trí đó. Nó cũng tìm kiếm phần tử có thanh cuộn trong DOM để thực hiện việc cuộn chính xác.
//- Component này được sử dụng để cải thiện trải nghiệm người dùng trong các ứng dụng có nhiều trang, giúp người dùng không bị mất vị trí cuộn khi họ điều hướng qua lại giữa các trang. Nó
//- là một phần quan trọng trong việc xây dựng các ứng dụng web hiện đại, nơi người dùng thường xuyên điều hướng giữa các trang và cần giữ nguyên vị trí cuộn để dễ dàng tiếp tục đọc hoặc tương tác với nội dung.
//- Component này sử dụng các kỹ thuật như useEffect để thực hiện các tác vụ phụ, useLocation để theo dõi đường dẫn, và các phương pháp DOM để tìm kiếm phần tử có thanh cuộn. Nó cũng sử dụng TypeScript để
//- đảm bảo kiểu dữ liệu và an toàn khi phát triển ứng dụng. Đây là một


import React from "react";
import { FC, useEffect } from "react";
import { useLocation } from "react-router";

const scrollPositions = {};

function findElementWithScrollbar(rootElement: Element = document.body) {
  if (rootElement.scrollHeight > rootElement.clientHeight) {
    // If the element has a scrollbar, return it
    return rootElement;
  }

  // If the element doesn't have a scrollbar, check its child elements
  for (let i = 0; i < rootElement.children.length; i++) {
    const childElement = rootElement.children[i];
    const elementWithScrollbar = findElementWithScrollbar(childElement);
    if (elementWithScrollbar) {
      // If a child element has a scrollbar, return it
      return elementWithScrollbar;
    }
  }

  // If none of the child elements have a scrollbar, return null
  return null;
}

export const ScrollRestoration: FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Look for the main scroll element on the page
    const content = findElementWithScrollbar();
    if (content) {
      const key = `${location.pathname}${location.search}`;
      if (scrollPositions[key]) {
        // Scroll to the previous position on this new location
        content.scrollTo(0, scrollPositions[key]);
      }
      const saveScrollPosition = (e: Event) => {
        // Save position on scroll
        scrollPositions[key] = content.scrollTop;
      };
      content.addEventListener("scroll", saveScrollPosition);
      return () => content.removeEventListener("scroll", saveScrollPosition);
    }
    return () => {};
  }, [location]);

  return <></>;
};
