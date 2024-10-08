import React, { FC, Suspense } from "react";
import { Section } from "components/section";
import { useRecoilValue } from "recoil";
import { productsState } from "state";
import { Box } from "zmp-ui";


export const ProductListContent: FC = () => {
  const products = useRecoilValue(productsState);

  return (
    <Section title="Thông tin hữu ích">
   
    </Section>
  );
};




export const ProductList: FC = () => {
  return (
      <ProductListContent />
  );
};
