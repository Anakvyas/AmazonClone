"use client";

import { buildAuthPath } from "@/lib/authRedirect";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/useStore";
import type { OrderDto } from "@/service/api";
import { getOrders } from "@/service/api";

const PAGE_SIZE = 5;

function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="grid gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 md:grid-cols-[repeat(4,minmax(0,1fr))]">
            {Array.from({ length: 4 }).map((__, metaIndex) => (
              <div key={metaIndex} className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>

          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-9 w-32 animate-pulse rounded-full bg-gray-200" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 2 }).map((__, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 md:flex-row"
                >
                  <div className="h-24 w-full animate-pulse rounded-xl bg-gray-100 md:w-24" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                    <div className="flex gap-4 pt-1">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                  <div className="h-5 w-20 animate-pulse rounded bg-gray-200 md:self-center" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const token = useStore((state) => state.token);
  const ordersTopRef = useRef<HTMLDivElement | null>(null);

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = await getOrders({ token, page, limit: PAGE_SIZE });
        if (!isMounted) return;
        setOrders(data.items);
        setTotalOrders(data.total);
        setHasMore(data.hasMore);
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
  }, [isLoggedIn, page, token]);

  useEffect(() => {
    if (page === 1) {
      return;
    }

    ordersTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);

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
              href={buildAuthPath("/login", "/orders")}
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
      <div ref={ordersTopRef} className="max-w-5xl mx-auto space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-950">Your Orders</h1>
            <p className="text-sm text-gray-600">
              Track your purchases and review what you ordered.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {totalOrders} order{totalOrders === 1 ? "" : "s"} found
          </p>
        </div>
        {loading && <OrdersLoadingSkeleton />}
        {error && (
          <p className="text-sm text-red-600" aria-live="polite">
            {error}
          </p>
        )}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
            You haven&apos;t placed any orders yet.
          </div>
        )}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="grid gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700 md:grid-cols-[repeat(4,minmax(0,1fr))]">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Order placed
                  </p>
                  <p className="mt-1 font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Total
                  </p>
                  <p className="mt-1 font-semibold">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Ship to
                  </p>
                  <p className="mt-1 font-semibold">Saved address</p>
                </div>
                <div className="md:text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Order #
                  </p>
                  <p className="mt-1 font-semibold">{order.id}</p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-950">Completed</p>
                    <p className="text-xs text-gray-500">
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      item
                      {order.items.reduce((sum, item) => sum + item.quantity, 0) > 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                  <Link
                    href={`/orders/confirmation?orderId=${order.id}`}
                    className="inline-flex rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    View order details
                  </Link>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 md:flex-row"
                    >
                      <div className="relative h-24 w-full overflow-hidden rounded-xl bg-gray-50 md:w-24">
                        <Image
                          src={item.product.images[0]?.url || "/favicon.ico"}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold text-gray-950">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.product.description}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {item.product.category.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                          <span>
                            Qty:{" "}
                            <span className="font-semibold">{item.quantity}</span>
                          </span>
                          <span>
                            Price:{" "}
                            <span className="font-semibold">
                              ${item.price.toFixed(2)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-950 md:text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && !error && totalOrders > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Page {page} of {Math.max(1, Math.ceil(totalOrders / PAGE_SIZE))}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || loading}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={!hasMore || loading}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
