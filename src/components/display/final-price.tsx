import React, { FC, useMemo } from "react";
import { SelectedOptions } from "@/types/cart";
import { Product } from "@/types/product";
import { calcFinalPrice } from "@/utilsproduct";
import { DisplayPrice } from "@/price";

export const FinalPrice: FC<{
  children: Product;
  options?: SelectedOptions;
}> = ({ children, options }) => {
  const finalPrice = useMemo(
    () => calcFinalPrice(children, options),
    [children, options],
  );
  return <DisplayPrice>{finalPrice}</DisplayPrice>;
};
