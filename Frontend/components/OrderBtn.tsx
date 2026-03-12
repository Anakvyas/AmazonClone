import Link from "next/link";
import React from "react";

const OrderBtn = () => {
  return (
    <Link
      href={"/orders"}
      className="relative hidden h-[70%] cursor-pointer flex-col justify-center border border-transparent px-2 text-xs text-gray-100 duration-300 hover:border-white md:flex"
    >
      <p>Orders</p>
      <p className="text-white font-bold">& Itemlists</p>

      <span className="absolute right-2 top-2 w-4 h-4 border-[1px] border-gray-400 flex items-center justify-center text-xs text-amazonOrangeDark font-medium rounded-sm">
        0
      </span>
    </Link>
  );
};

export default OrderBtn;
