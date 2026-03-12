"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/useStore";
import { BackendProduct, getProducts, mapBackendProductToUi } from "@/service/api";

interface ProductsListProps {
  initialProducts: BackendProduct[];
  initialHasMore: boolean;
}

const ProductsList = ({
  initialProducts,
  initialHasMore,
}: ProductsListProps) => {
  const [products, setProducts] = useState<BackendProduct[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const addToCart = useStore((state) => state.addToCart);
  const addToFavorite = useStore((state) => state.addToFavorite);

  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialHasMore);
    setPage(1);
    setError(null);
  }, [initialHasMore, initialProducts]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasMore || loadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        setLoadingMore(true);
      },
      {
        rootMargin: "300px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadingMore]);

  useEffect(() => {
    if (!loadingMore) {
      return;
    }

    let isCancelled = false;

    const loadNextPage = async () => {
      try {
        const nextPage = page + 1;
        const response = await getProducts({ page: nextPage, limit: 10 });

        if (isCancelled) {
          return;
        }

        setProducts((current) => {
          const seenIds = new Set(current.map((item) => item.id));
          const nextItems = response.items.filter((item) => !seenIds.has(item.id));
          return [...current, ...nextItems];
        });
        setPage(response.page);
        setHasMore(response.hasMore);
      } catch (err) {
        if (isCancelled) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to load more products.";
        setError(message);
      } finally {
        if (!isCancelled) {
          setLoadingMore(false);
        }
      }
    };

    void loadNextPage();

    return () => {
      isCancelled = true;
    };
  }, [loadingMore, page]);

  if (error) {
    return (
      <div className="text-sm text-red-600" aria-live="polite">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-sm text-gray-600">
        No products found. Please add some products in the backend.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const uiProduct = mapBackendProductToUi(product);

          return (
            <div
              key={product.id}
              className="bg-white rounded-md shadow-sm border border-gray-200 p-4 flex flex-col"
            >
              {uiProduct.thumbnail && (
                <div className="w-full h-48 mb-3 relative">
                  <Image
                    src={uiProduct.thumbnail}
                    alt={uiProduct.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                {uiProduct.title}
              </h3>
              <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                {uiProduct.description}
              </p>
              <div className="mt-2 text-base font-bold text-gray-900">
                ${uiProduct.price.toFixed(2)}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => void addToCart(uiProduct)}
                  className="flex-1 py-1.5 px-3 rounded-full bg-amazonOrange hover:bg-amazonOrangeDark text-xs font-medium text-black"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => void addToFavorite(uiProduct)}
                  className="px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-800 hover:bg-gray-50"
                >
                  Wishlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {hasMore ? (
        <div ref={sentinelRef} className="py-4 text-center text-sm text-gray-500">
          {loadingMore ? "Loading more products..." : "Scroll to load more"}
        </div>
      ) : (
        <div className="py-4 text-center text-sm text-gray-500">
          You&apos;ve reached the end of the catalog.
        </div>
      )}
    </div>
  );
};

export default ProductsList;
