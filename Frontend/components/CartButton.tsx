"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cartIcon } from "../assets";
import { useStore } from "@/lib/useStore";

const CartButton = () => {
  const cartProduct = useStore((state) => state.cartProduct);
  const cartCount = cartProduct.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <Link
      href={"/cart"}
      className="relative flex h-[70%] items-center border border-transparent px-2 duration-300 hover:border-white"
    >
      <Image
        src={cartIcon}
        alt="cartIcon"
        className="w-auto object-cover h-8"
      />
      <p className="text-xs text-white font-bold mt-3">Cart</p>
      <span className="absolute left-6 top-0 flex min-w-5 items-center justify-center rounded-md border border-gray-400 bg-[#131921] px-1 text-xs font-semibold text-amazonOrangeDark">
        {cartCount}
      </span>
    </Link>
  );
};

export default CartButton;
