"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStore } from "@/lib/useStore";
import { BackendProduct, getProducts, mapBackendProductToUi } from "@/service/api";

interface ProductsListProps {
  initialProducts: BackendProduct[];
  initialHasMore: boolean;
  searchQuery: string;
  category: string;
}

const ProductsList = ({
  initialProducts,
  initialHasMore,
  searchQuery,
  category,
}: ProductsListProps) => {
  const [products, setProducts] = useState<BackendProduct[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const addToCart = useStore((state) => state.addToCart);
  const addToFavorite = useStore((state) => state.addToFavorite);

  const handleAddToCart = async (
    productId: number,
    product: ReturnType<typeof mapBackendProductToUi>
  ) => {
    setActiveCartId(productId);
    await addToCart(product);
    toast.success(`${product.title} added to cart`);

    window.setTimeout(() => {
      setActiveCartId((current) => (current === productId ? null : current));
    }, 900);
  };

  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialHasMore);
    setPage(1);
    setError(null);
  }, [initialHasMore, initialProducts]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const syncMobileView = () => {
      setIsMobileView(mediaQuery.matches);
    };

    syncMobileView();
    mediaQuery.addEventListener("change", syncMobileView);

    return () => {
      mediaQuery.removeEventListener("change", syncMobileView);
    };
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasMore || loadingMore || isMobileView) {
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
  }, [hasMore, isMobileView, loadingMore]);

  useEffect(() => {
    if (!loadingMore) {
      return;
    }

    let isCancelled = false;

    const loadMoreProducts = async () => {
      try {
        const nextPage = page + 1;
        const response = await getProducts({
          page: nextPage,
          limit: 10,
          search: searchQuery || undefined,
          category: category !== "All" ? category : undefined,
        });

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

    void loadMoreProducts();

    return () => {
      isCancelled = true;
    };
  }, [category, loadingMore, page, searchQuery]);

  useEffect(() => {
    if (!isMobileView || !hasMore || loadingMore) {
      return;
    }

    setLoadingMore(true);
  }, [hasMore, isMobileView, loadingMore, page, products.length]);

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
              onClick={() => router.push(`/product/${product.id}`)}
              className="group relative cursor-pointer bg-white rounded-md shadow-sm border border-gray-200 p-4 flex flex-col transition-[box-shadow,transform] duration-200 hover:z-10 hover:-translate-y-1 hover:shadow-xl"
            >
              {uiProduct.thumbnail && (
                <div className="w-full h-48 mb-3 relative overflow-hidden rounded-md">
                  <Image
                    src={uiProduct.thumbnail}
                    alt={uiProduct.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
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
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleAddToCart(product.id, uiProduct);
                  }}
                  className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium text-black transition ${
                    activeCartId === product.id
                      ? "bg-green-400 shadow-lg shadow-green-200"
                      : "bg-amazonOrange hover:bg-amazonOrangeDark"
                  }`}
                >
                  {activeCartId === product.id ? "Added" : "Add to Cart"}
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    void addToFavorite(uiProduct);
                  }}
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
        <div className="space-y-3 py-4 text-center text-sm text-gray-500">
          <div ref={sentinelRef}>
            {loadingMore
              ? "Loading more products..."
              : isMobileView
                ? "Loading full catalog..."
                : "Scroll to load more"}
          </div>
          <button
            type="button"
            onClick={() => {
              if (!loadingMore) {
                setLoadingMore(true);
              }
            }}
            disabled={loadingMore}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading..." : "Load more products"}
          </button>
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
