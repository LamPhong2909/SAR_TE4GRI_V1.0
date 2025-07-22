import React, { FC, memo, useCallback } from "react";
// Loại bỏ 'Lazy' khỏi danh sách import module của Swiper
import { Autoplay, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Text, useNavigate } from "zmp-ui";

// Import Swiper core and module styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
// Loại bỏ import "swiper/css/lazy";
import "swiper/css/a11y";

// --- Constants and Configuration ---
const BANNER_AUTOPLAY_DELAY = 3500;
const BANNER_DEFAULT_ASPECT_RATIO = "aspect-[2/1]"; // Ví dụ: tỷ lệ 2:1

interface BannerItem {
  id: string | number;
  imageUrl: string;
  altText: string;
  targetUrl?: string;
  title?: string;
  trackingId?: string; // Để theo dõi sự kiện click nếu cần
}

// Dữ liệu banner mẫu (có thể thay thế bằng dữ liệu từ API)
const DEFAULT_BANNER_DATA: BannerItem[] = [
  {
    id: "banner-promo-001",
    imageUrl: "https://res.cloudinary.com/dozxc6jqp/image/upload/v1731169421/banner-4_ywsrjc.png",
    altText: "Banner quảng bá sản phẩm mới ra mắt với nhiều ưu đãi hấp dẫn",
    targetUrl: "/promotion/new-arrival-event",
    title: "Sản Phẩm Mới Ra Mắt",
    trackingId: "NEW_ARRIVAL_PROMO_CLICK",
  },
  {
    id: "banner-event-002",
    imageUrl: "https://res.cloudinary.com/dozxc6jqp/image/upload/v1731169420/banner_5_wqhs8u",
    altText: "Banner thông báo sự kiện đặc biệt tháng 5 với các hoạt động cộng đồng",
    targetUrl: "/events/may-community-fest",
    title: "Vì 1 tương lai nông nghiệp thông minh",
  },
  {
    id: "banner-highlight-003",
    imageUrl: "https://res.cloudinary.com/dozxc6jqp/image/upload/v1731169420/banner_6_w1c4ly",
    altText: "Banner giới thiệu tính năng nổi bật của ứng dụng TE4GRI",
    title: "Khám Phá TE4GRI",
  },
  {
    id: "banner-community-004",
    imageUrl: "https://res.cloudinary.com/dozxc6jqp/image/upload/v1731169421/banner-3_mxf9x8.jpg",
    altText: "Banner kêu gọi tham gia cộng đồng người dùng TE4GRI",
    targetUrl: "/community",
    title: "Giải pháp tối ưu kỷ nguyên AI !",
  },
];

interface AppBannerProps {
  banners?: BannerItem[];
  className?: string;
  onBannerClick?: (banner: BannerItem, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  autoplayEnabled?: boolean;
  loopEnabled?: boolean;
  aspectRatio?: string; // Cho phép tùy chỉnh tỷ lệ khung hình
}

const AppBannerComponent: FC<AppBannerProps> = ({
  banners = DEFAULT_BANNER_DATA,
  className = "",
  onBannerClick,
  autoplayEnabled = true,
  loopEnabled = true,
  aspectRatio = BANNER_DEFAULT_ASPECT_RATIO,
}) => {
  const navigate = useNavigate();

  const handleBannerInteraction = useCallback(
    (banner: BannerItem, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // Ghi log hoặc gửi sự kiện tracking nếu cần
      if (banner.trackingId) {
        console.log(`Banner Interaction Triggered: ${banner.trackingId}, Title: ${banner.title || 'N/A'}`);
        // Ví dụ: Gửi đến một hệ thống analytics
        // analytics.track('banner_click', { banner_id: banner.trackingId, banner_title: banner.title });
      }

      if (onBannerClick) {
        onBannerClick(banner, event);
      } else if (banner.targetUrl) {
        if (banner.targetUrl.startsWith("http")) {
          // Xử lý mở liên kết ngoài một cách an toàn (nếu Zalo Mini App cho phép và có API riêng)
          console.warn(
            `Attempting to open external link: ${banner.targetUrl}. Ensure Zalo Mini App policy compliance and use appropriate API if available.`
          );
          // window.open(banner.targetUrl, "_blank", "noopener,noreferrer"); // Cân nhắc kỹ về bảo mật và chính sách ZMA
        } else {
          navigate(banner.targetUrl, { replace: false, state: { fromBanner: banner.id } });
        }
      }
    },
    [navigate, onBannerClick]
  );

  if (!banners || banners.length === 0) {
    return (
      <Box
        className={`bg-gray-100 dark:bg-gray-700 ${aspectRatio} w-full rounded-lg flex items-center justify-center text-center p-4 ${className}`}
      >
        <Text size="small" className="text-gray-500 dark:text-gray-400">
          Hiện không có banner nào để hiển thị.
        </Text>
      </Box>
    );
  }

  return (
    <Box className={`bg-transparent ${className}`} pb={0} aria-roledescription="carousel" aria-label="Danh sách banner quảng cáo">
      <Swiper
        // Loại bỏ 'Lazy' khỏi danh sách modules
        modules={[Autoplay, Pagination, A11y]}
        pagination={{
          clickable: true,
          dynamicBullets: banners.length > 5, // Hiển thị dynamic bullets nếu có nhiều hơn 5 banner
          renderBullet: function (index, clsName) {
            // Tùy chỉnh giao diện của bullet, thêm title để tăng khả năng tiếp cận
            return `<span class="${clsName} w-2 h-2 md:w-2.5 md:h-2.5 inline-block rounded-full cursor-pointer mx-1 bg-gray-400 dark:bg-gray-600 opacity-70 hover:opacity-100 dark:hover:bg-gray-500 transition-opacity" title="Đi đến banner ${index + 1}"></span>`;
          },
        }}
        autoplay={
          autoplayEnabled && banners.length > 1 // Chỉ autoplay nếu được bật và có nhiều hơn 1 banner
            ? {
                delay: BANNER_AUTOPLAY_DELAY,
                disableOnInteraction: false, // Cho phép autoplay tiếp tục sau khi người dùng tương tác (ví dụ: click next/prev)
                pauseOnMouseEnter: true, // Tạm dừng autoplay khi chuột trỏ vào banner
              }
            : false
        }
        loop={loopEnabled && banners.length > 1} // Chỉ loop nếu được bật và có nhiều hơn 1 banner
        // Loại bỏ hoàn toàn prop 'lazy'
        a11y={{
          enabled: true,
          prevSlideMessage: "Banner trước",
          nextSlideMessage: "Banner kế tiếp",
          paginationBulletMessage: "Đi đến banner số {{index}}",
          containerMessage: "Carousel chứa các banner quảng cáo",
          containerRoleDescriptionMessage: "Trình chiếu",
          itemRoleDescriptionMessage: "Banner",
        }}
        grabCursor={banners.length > 1} // Hiển thị con trỏ grab nếu có thể vuốt
        watchSlidesProgress={false} // Không cần thiết nếu không dùng lazy loading của Swiper
        className="w-full rounded-lg overflow-hidden shadow-lg dark:shadow-2xl" // Thêm hiệu ứng đổ bóng tinh tế
      >
        {banners.map((banner) => (
          <SwiperSlide
            key={banner.id}
            onClick={(e) => handleBannerInteraction(banner, e as any)} // (e as any) để tạm thời bỏ qua type event nếu phức tạp
            className={`bg-transparent ${banner.targetUrl || onBannerClick ? "cursor-pointer" : ""}`}
            role="group" // Giúp screen reader hiểu đây là một nhóm nội dung trong carousel
            aria-roledescription="slide" // Mô tả vai trò của item này là một "slide"
            aria-label={banner.title || banner.altText} // Nhãn mô tả cho screen reader
          >
            <Box
              className={`w-full rounded-lg ${aspectRatio} bg-gray-200 dark:bg-gray-800 bg-cover bg-center relative overflow-hidden transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50`}
            >
              {/* Thay data-src thành src, bỏ class swiper-lazy, giữ lại loading="lazy" của trình duyệt */}
              <img
                src={banner.imageUrl}
                alt={banner.altText} // Quan trọng cho A11y và SEO
                className="w-full h-full object-cover absolute inset-0" // Đảm bảo ảnh che phủ toàn bộ box
                loading="lazy" // Native browser lazy loading - Vẫn giữ lại để tối ưu!
                decoding="async" // Gợi ý trình duyệt giải mã ảnh bất đồng bộ
                fetchpriority="auto" // Để trình duyệt tự quyết định độ ưu tiên tải
              />
              {/* Loại bỏ swiper-lazy-preloader */}
              {banner.title && (
                <Box className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                  <Text className="text-white text-sm md:text-base font-semibold leading-tight shadow-text-lg">
                    {banner.title}
                  </Text>
                </Box>
              )}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export const Banner = memo(AppBannerComponent);