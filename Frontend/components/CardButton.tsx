"use client";

import { Product } from "@/types/product";
import { useStore } from "@/lib/store";

interface Props {
  product: Product;
}

const CardButton = ({ product }: Props) => {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="w-full rounded-md bg-amazonOrange px-4 py-2 text-sm font-semibold text-black transition hover:bg-amazonOrangeDark"
    >
      Add to Cart
    </button>
  );
};

export default CardButton;
