"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/useStore";
import type { OrderDto } from "@/service/api";
import { getOrders } from "@/service/api";

export default function OrdersPage() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const token = useStore((state) => state.token);

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = await getOrders(token);
        if (!isMounted) return;
        setOrders(data);
      } catch (err) {
        if (!isMounted) return;
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load your orders. Please try again.";
        setError(message);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, token]);

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
        {loading && (
          <p className="text-sm text-gray-600">Loading your orders...</p>
        )}
        {error && (
          <p className="text-sm text-red-600" aria-live="polite">
            {error}
          </p>
        )}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-md p-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">Order placed:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> $
                    {order.totalPrice.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Order #:</span> {order.id}
                  </p>
                </div>
                <div className="text-sm text-gray-700 text-right">
                  <p className="font-semibold">Completed</p>
                  <p className="text-xs text-gray-500">
                    {order.items.length} item
                    {order.items.length > 1 ? "s" : ""}
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
