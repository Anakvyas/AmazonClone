"use client";

import Link from "next/link";
import { useStore } from "@/lib/useStore";

const dummyOrders = [
  {
    id: "ORDER-123456",
    date: "March 10, 2026",
    total: 89.99,
    items: 2,
    status: "Delivered",
  },
  {
    id: "ORDER-987654",
    date: "February 25, 2026",
    total: 39.49,
    items: 1,
    status: "Shipped",
  },
];

export default function OrdersPage() {
  const { isLoggedIn } = useStore((state) => ({
    isLoggedIn: state.isLoggedIn,
  }));

  if (!isLoggedIn) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Orders
          </h1>
          <p className="text-sm text-gray-600">
            Please{" "}
            <Link
              href="/login"
              className="text-amazonBlue hover:text-amazonOrange"
            >
              sign in
            </Link>{" "}
            to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[60vh] px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Your Orders</h1>
        <div className="space-y-4">
          {dummyOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-md p-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">Order placed:</span>{" "}
                    {order.date}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> $
                    {order.total.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Order #:</span> {order.id}
                  </p>
                </div>
                <div className="text-sm text-gray-700 text-right">
                  <p className="font-semibold">{order.status}</p>
                  <p className="text-xs text-gray-500">
                    {order.items} item{order.items > 1 ? "s" : ""}
                  </p>
                  <button
                    type="button"
                    className="mt-2 inline-flex justify-center py-1 px-3 text-xs font-medium rounded-full border border-gray-300 hover:bg-gray-50"
                  >
                    View order details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

