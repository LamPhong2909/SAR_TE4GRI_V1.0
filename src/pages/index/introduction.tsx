{/* 5*/ }

import { FinalPrice } from "components/display/final-price";
import { DisplayPrice } from "components/display/price";
import { ProductPicker } from "components/product/picker";
import { Section } from "components/section";
import { ProductSlideSkeleton } from "components/skeletons";
import React, { Suspense } from "react";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { recommendProductsState } from "state";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Text } from "zmp-ui";
import { AdvancedImage } from "@cloudinary/react";
import * as image from 'static/cloudIMG'; // Wildcard import


export const RecommendContent: FC = () => {
  const recommendProducts = useRecoilValue(recommendProductsState);


  return (
    <Section title="Hướng dẫn sử dụng" padding="title-only">
      <div className="tutorial flex justify-between">
        <AdvancedImage
          cldImg={image.step1}
          alt="bước 1"
          style={{ width: '87px', height: '101px', marginLeft: '50px' }}
        />
        <AdvancedImage
          cldImg={image.step2}
          alt="bước 2"
          style={{ width: '87px', height: '108px' }}
        />
        <AdvancedImage
          cldImg={image.step3}
          alt="bước 3"
          style={{ width: '87px', height: '140px', marginRight: '50px' }}
        />
      </div>

    </Section>
  );
};

export const Introduction: FC = () => {
  return (
    <RecommendContent />
  );
};
