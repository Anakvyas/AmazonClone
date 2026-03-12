"use client";
import Link from "next/link";
import React from "react";
import { useStore } from "@/lib/useStore";

const FavoriteButton = () => {
  const favoriteProduct = useStore((state) => state.favoriteProduct);
  const favoriteCount = favoriteProduct.length;

  return (
    <Link
      href={"/favorite"}
      className="relative hidden h-[70%] cursor-pointer flex-col justify-center border border-transparent px-2 text-xs text-gray-100 duration-300 hover:border-white xl:inline-flex"
    >
      <p>Marked</p>
      <p className="text-white font-bold">& Favorite</p>

      <span className="absolute right-1 top-1 flex min-w-5 items-center justify-center rounded-md border border-gray-400 bg-[#131921] px-1 text-xs font-semibold text-amazonOrangeDark">
        {favoriteCount}
      </span>
    </Link>
  );
};

export default FavoriteButton;
