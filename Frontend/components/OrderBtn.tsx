"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getOrders } from "@/service/api";
import { useStore } from "@/lib/useStore";

const OrderBtn = () => {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const token = useStore((state) => state.token);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setOrderCount(0);
      return;
    }

    let isMounted = true;

    const loadOrders = async () => {
      try {
        const orders = await getOrders(token);
        if (!isMounted) {
          return;
        }

        setOrderCount(orders.length);
      } catch {
        if (isMounted) {
          setOrderCount(0);
        }
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, token]);

  return (
    <Link
      href={"/orders"}
      className="relative flex h-[70%] cursor-pointer flex-col justify-center border border-transparent px-2 text-xs text-gray-100 duration-300 hover:border-white"
    >
      <p className="leading-none">Orders</p>
      <p className="hidden text-white font-bold md:block">& Itemlists</p>

      <span className="absolute right-[-15px] top-[-4px] sm:right-[6px] sm:top-[2px] flex min-w-5 items-center justify-center rounded-md border border-gray-400 bg-[#131921] px-1 text-xs font-semibold text-amazonOrangeDark">
        {orderCount}
      </span>
    </Link>
  );
};

export default OrderBtn;
