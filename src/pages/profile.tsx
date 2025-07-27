/* ABOUT US Page 27-07 */


// - Đây là trang hồ sơ cá nhân trong ứng dụng TE4GRI, nơi người dùng có thể quản lý thông tin cá nhân, đăng ký thành viên, xem lịch sử đơn hàng và liên hệ với đội ngũ hỗ trợ.



// - Nó bao gồm các thành phần như đăng ký thành viên, thông tin cá nhân và các tùy chọn khác như đánh giá đơn hàng và liên hệ góp ý.

// - Trang này sử dụng các thành phần từ thư viện ZMP UI để tạo giao diện người dùng, bao gồm Header, Box, Icon, Page và Text.
// - Các chức năng như đăng ký thành viên và các tùy chọn cá nhân được xử lý thông qua các hàm tùy chỉnh, giúp người dùng
//   tương tác với ứng dụng một cách dễ dàng và thuận tiện.
// - Trang này cũng sử dụng các hook tùy chỉnh để xử lý các chức năng như
//   thông báo "đang được triển khai" khi người dùng nhấn vào các tùy chọn chưa được phát triển.
// - Các thành phần được sắp xếp theo dạng danh sách, giúp người dùng dễ dàng truy cập và quản lý thông tin cá nhân của mình.
// - Đây là một phần quan trọng của ứng dụng, giúp người dùng có thể quản lý tài khoản và tương tác với các dịch vụ
//   khác trong ứng dụng TE4GRI một cách hiệu quả.
// - File này sử dụng các kỹ thuật như React Functional Components, TypeScript, và ZMP UI để xây dựng giao diện người dùng.
// - Nó cũng sử dụng các hook tùy chỉnh để xử lý các chức năng tương tác với người dùng, như thông báo và điều hướng.


// To enhance significantly this file sophisticatedly and professionally, we can consider the following improvements:
//       1. **Tối ưu hóa hiệu suất**: Sử dụng React.memo để tránh render lại các thành phần không cần thiết, giúp cải thiện hiệu suất của ứng dụng.
////       2. **Quản lý trạng thái**: Sử dụng Recoil hoặc Redux để quản lý trạng thái toàn cục của ứng dụng, giúp dễ dàng chia sẻ dữ liệu giữa
//          các thành phần khác nhau và giảm thiểu việc truyền props qua nhiều cấp.
//       3. **Kiểm thử**: Viết các bài kiểm thử đơn vị và kiểm thử tích hợp cho các thành phần và chức năng của ứng dụng, đảm bảo rằng mọi
//          thứ hoạt động đúng như mong đợi và dễ dàng bảo trì trong tương lai.
//       4. **Tối ưu hóa truy cập dữ liệu**: Sử dụng React Query hoặc SWR để quản lý việc lấy dữ liệu từ API, giúp giảm thiểu số
//          lần gọi API không cần thiết và cải thiện trải nghiệm người dùng bằng cách cache dữ liệu.
//       5. **Tối ưu hóa giao diện người dùng**: Sử dụng CSS-in-JS hoặc styled-components để quản lý kiểu dáng của các thành phần, giúp dễ
//          dàng thay đổi giao diện mà không cần phải chỉnh sửa nhiều tệp CSS.
//       6. **Tối ưu hóa khả năng truy cập**: Đảm bảo rằng các thành phần giao diện người dùng tuân thủ các tiêu chuẩn về khả năng truy cập,
//          bao gồm việc sử dụng các thuộc tính ARIA, đảm bảo rằng ứng dụng có thể sử dụng được với các công cụ hỗ trợ như trình


import React, { FC } from "react";
import { Box, Header, Icon, Page, Text } from "zmp-ui"; // Trước giờ cứ dùng mấy cái icon lấy từ những icon mình upload lên cloudinary mà không biết là mình đã sai vì cloudinary cuối cùng cũng chỉ là static thôi , không có dynamic và interactive nhỉ ?
// - Đúng vậy, Cloudinary chủ yếu được sử dụng để lưu trữ và quản lý hình ảnh tĩnh. Các icon được tải lên Cloudinary sẽ không có tính năng tương tác động như các icon từ thư viện icon động (ví dụ: Font Awesome, Material Icons). Tuy nhiên, bạn vẫn có thể sử dụng các icon tĩnh từ Cloudinary trong ứng dụng của mình, nhưng chúng sẽ không có các hiệu ứng động hoặc tương tác mà các thư viện icon động cung cấp.
// Thế hãy nghiên cứu và thiết kế 1 bản kỹ thuật đặc tả hoặc usecase gì đó để biết tường tận khi nào dùng các icon/asset tĩnh từ cloudinary dùng API để call từ những thứ static mà mình đã up lên ?
//- - Để sử dụng các icon/asset tĩnh từ Cloudinary một cách hiệu quả, bạn có thể thực hiện các bước sau:
//       1. **Xác định nhu cầu sử dụng**: Trước tiên, bạn cần xác định các icon hoặc asset nào sẽ được sử dụng trong ứng dụng của mình. Điều  này bao gồm việc xác định các biểu tượng cần thiết cho các chức năng khác nhau trong ứng dụng, chẳng hạn như nút điều hướng, biểu tượng thông báo, v.v.
//       2. **Tải lên Cloudinary**: Tải lên các icon hoặc asset tĩnh lên Cloudinary. Bạn có thể sử dụng giao diện web của Cloudinary hoặc API
//          để tải lên các tệp hình ảnh. Đảm bảo rằng bạn đã đặt tên các tệp một cách rõ ràng và có thể nhận diện được để dễ dàng sử dụng sau
//          này.
//       3. **Lấy URL của các tệp**: Sau khi tải lên, Cloudinary sẽ cung cấp cho bạn các URL để truy cập các tệp hình ảnh. Bạn
//          có thể sử dụng các URL này trong mã nguồn của mình để hiển thị các
import subscriptionDecor from "static/subscription-decor.svg";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";

//import "../css/profile.scss"; // Đây là file css của trang profile.tsx này (sẽ TẠO SAU NẾU CẦN THIẾT) để định dạng và tạo kiểu cho các thành phần trong trang hồ sơ cá nhân.
import { AdvancedImage } from "@cloudinary/react"; // Cho các ảnh static , ví dụ logo hay banner hay background gì đó




/* REAL CODE SESSION */


const Subscription: FC = () => {
  // Đây là một phần của trang hồ sơ cá nhân, nơi người dùng có thể đăng ký thành viên để nhận các lợi ích như tích điểm đổi thưởng và mở rộng tiện ích.
  const onClick = useToBeImplemented(); //UsetoBeImplemented là một hook tùy chỉnh để xử lý các chức năng chưa được phát triển, trong trường hợp này là đăng ký thành viên.

  // Khi người dùng nhấn vào phần đăng ký thành viên, nó sẽ hiển thị thông báo "Chức năng đang trong giai đoạn phát triển, hãy chờ SAR nhé !"
  return (
    <Box className="m-4" onClick={onClick}>
      <Box
        className="bg-green text-white rounded-xl p-4 space-y-2"
        style={{
          backgroundImage: `url(${subscriptionDecor})`,
          backgroundPosition: "right 8px center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Text.Title className="font-bold">Đăng ký thành viên</Text.Title>
        <Text size="xxSmall">Tích điểm đổi thưởng, mở rộng tiện ích</Text>
      </Box>
    </Box>
  );
};

const Personal: FC = () => {
  const onClick = useToBeImplemented();

  return (
    <Box className="m-4">
      <ListRenderer
        title="Cá nhân"
        onClick={onClick}
        items={[
          {
            left: <Icon icon="zi-user" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Thông tin tài khoản
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-clock-2" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Lịch sử đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const Other: FC = () => {
  const onClick = useToBeImplemented();

  return (
    <Box className="m-4">
      <ListRenderer
        title="Khác"
        onClick={onClick}
        items={[
          {
            left: <Icon icon="zi-star" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Đánh giá đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-call" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Liên hệ và góp ý
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const ProfilePage: FC = () => {
  return (
    <Page>
      <Header showBackIcon={false} title="&nbsp;" />
      <Subscription />
      <Personal />
      <Other />
    </Page>
  );
};

export default ProfilePage;
