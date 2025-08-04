import { useVirtualKeyboardVisible } from "./src/hooks";
import React, { FC, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MenuItem } from "types/menu";
import { BottomNavigation, Icon } from "zmp-ui";
import { CartIcon } from "./cart-icon";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const tabs: Record<string, MenuItem> = {
// Record<string, MenuItem> là một kiểu dữ liệu trong TypeScript, cho phép bạn định nghĩa một đối tượng với các khóa là chuỗi và giá trị là kiểu MenuItem. Điều này giúp đảm bảo rằng các khóa trong đối tượng sẽ là chuỗi và giá trị tương ứng sẽ tuân theo cấu trúc của MenuItem.

  "/": {
    label: "Trang chủ",
    icon: <Icon icon="zi-home" />,
  },
  "/scan": {
    label: "Chụp ảnh",
    icon: <Icon icon="zi-camera" />,
  },
  "/cart": { // NOTE : SAU NÀY CART SẼ thay đổi hoàn toàn 1 chức năng tinh vi và thông minh có thể tên là Calculation thiên về tính toán nhỉ ? Bạn cố vấn tôi sâu sắc tôi thử xem nếu chúng tôi không muốn liên quan chút gì đến mua bán vì TE4GRI chúng tôi hoàn toàn là phần mềm ấy ?
    // - Đúng vậy, nếu bạn muốn thay đổi chức năng của trang giỏ hàng (cart) thành một chức năng thiên về tính toán, bạn có thể đặt tên là "Calculation" hoặc "Tính toán". Trang này có thể bao gồm các tính năng như:
    //   1. **Tính toán chi phí**: Người dùng có thể nhập các thông tin về sản phẩm, số lượng, và giá cả ví dụ như về thuốc hóa học trừ sâu bệnh để tính toán tổng chi phí
    //  2. **Tính toán lợi nhuận**: Người dùng có thể nhập thông tin về chi phí sản xuất và giá bán để tính toán lợi nhuận dự kiến.
    label: "Tính toán",
    icon: <Icon icon ='zi-check-circle' />,
  },
  "/profile": {
    label: "Cá nhân",
    icon: <Icon icon="zi-user" />,
  },
};

export type TabKeys = keyof typeof tabs; // Dòng này tức là chúng ta đang định nghĩa một kiểu dữ liệu mới có tên là TabKeys, nó sẽ là một trong các khóa của đối tượng tabs. Điều này giúp đảm bảo rằng các giá trị của TabKeys sẽ luôn là một trong các đường dẫn đã được định nghĩa trong tabs.

export const NO_BOTTOM_NAVIGATION_PAGES = ["/search", "/category", "/result"]; //Dòng này tức là chúng ta đang định nghĩa một mảng các đường dẫn mà không cần hiển thị thanh điều hướng dưới cùng. Điều này có thể được sử dụng để ẩn thanh điều hướng trong các trang cụ thể, chẳng hạn như trang tìm kiếm, danh mục hoặc kết quả.
// Page mà dành cho SEARCH sau này sẽ là chỗ để nông dân tìm kiếm thông tin về nông nghiệp, tìm kiếm các sản phẩm nông nghiệp, hoặc tìm kiếm các dịch vụ hỗ trợ nông nghiệp. Nó có thể bao gồm các tính năng như tìm kiếm theo từ khóa, lọc kết quả theo danh mục, và hiển thị thông tin chi tiết về các sản phẩm hoặc dịch vụ được tìm thấy.



export const Navigation: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate(); //useNavigate là một hook trong React Router, cho phép bạn điều hướng đến các trang khác trong ứng dụng. Nó trả về một hàm navigate mà bạn có thể sử dụng để chuyển hướng người dùng đến một đường dẫn cụ thể.
  const location = useLocation();

  const noBottomNav = useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (noBottomNav || keyboardVisible) {
    return <></>; //Dòng này nếu giải thích tinh vi là nếu không có thanh điều hướng dưới cùng hoặc bàn phím ảo đang hiển thị, thì không cần hiển thị thanh điều hướng dưới cùng, do đó trả về một thành phần rỗng.
  }

  return (
    <BottomNavigation
      id="footer"
      activeKey={location.pathname}
      onChange={navigate}
      className="z-50"
    >
      {Object.keys(tabs).map((path: TabKeys) => (
        <BottomNavigation.Item
          key={path}
          label={tabs[path].label}
          icon={tabs[path].icon}
          activeIcon={tabs[path].activeIcon}
        />
      ))}
    </BottomNavigation>
  );
};
