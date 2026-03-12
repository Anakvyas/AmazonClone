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
      className="relative hidden h-[70%] cursor-pointer flex-col justify-center border border-transparent px-2 text-xs text-gray-100 duration-300 hover:border-white md:flex"
    >
      <p>Orders</p>
      <p className="text-white font-bold">& Itemlists</p>

      <span className="absolute right-[9px] top-[3px] flex min-w-5 items-center justify-center rounded-md border border-gray-400 bg-[#131921] px-1 text-xs font-semibold text-amazonOrangeDark">
        {orderCount}
      </span>
    </Link>
  );
};

export default OrderBtn;
