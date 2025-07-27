import React from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoriesState, selectedCategoryIdState } from "state";
import { useNavigate } from "react-router-dom";
import { AdvancedImage } from "@cloudinary/react";

import * as image from "static/cloudIMG"; 

export const Categories = () => {
  const categories = useRecoilValue(categoriesState);
  const navigate = useNavigate();
  const setSelectedCategoryId = useSetRecoilState(selectedCategoryIdState);

  const gotoCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    navigate("/category");
  };

  // Make sure there are exactly 6 categories or adjust this list accordingly
  const categoryIcons: { [key: string]: any } = {
    diary: image.calendarIcon,
    scan: image.scanIcon,
    search: image.searchIcon,
    data: image.dataIcon,
    advice: image.adviceImage,
    message: image.messageIcon,
  };

  return (
    <Box className="bg-white p-4">
      <Box
        className="grid grid-cols-3 gap-4"
        style={{ gridTemplateRows: "repeat(2, auto)" }} // Tạo 2 hàng
      >
        {categories.slice(0, 6).map(
          (
            category,
            i // Giới hạn phần tử đến 6
          ) => (
            <div //LÀ ICON FUNCTION THAY VÌ TỚI THẲNG TRANG THÌ NÓ SẼ TỚI DANH MỤC ---> MỚI
              key={i}
              onClick={() => gotoCategory(category.id)}
              className="flex flex-col space-y-2 items-center"
              style={{ //Style này là cho cái ô
                backgroundColor: "#F5F5F5",
                borderRadius: "25%",
                padding: "10px",
              }}
            >
              <AdvancedImage
                className="w-22 h-12"
                cldImg={categoryIcons[category.id]}
                alt={category.name}
              />
            </div>
          )
        )}
      </Box>
    </Box>
  );
};
