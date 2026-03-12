"use client";

import { Slider } from "@/components/ui/slider";
import { useStore } from "@/lib/useStore";
import { getProducts, mapBackendProductToUi } from "@/service/api";
import type { Product } from "@/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function ProductsCatalogPage() {
  const router = useRouter();
  const addToCart = useStore((state) => state.addToCart);
  const addToFavorite = useStore((state) => state.addToFavorite);
  const favoriteProduct = useStore((state) => state.favoriteProduct);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"default" | "desc" | "asc">(
    "default"
  );
  const [priceCap, setPriceCap] = useState<number>(1000);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);
  const [activeWishlistId, setActiveWishlistId] = useState<number | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const collected: Product[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await getProducts({ page, limit: 20 });

          if (isCancelled) {
            return;
          }

          collected.push(...response.items.map(mapBackendProductToUi));
          hasMore = response.hasMore;
          page = response.page + 1;
        }

        setProducts(collected);
      } catch (err) {
        if (isCancelled) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to load products.";
        setError(message);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadAllProducts();

    return () => {
      isCancelled = true;
    };
  }, []);

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [products]
  );

  const maxPrice = useMemo(
    () =>
      products.length
        ? Math.ceil(Math.max(...products.map((product) => product.price)))
        : 1000,
    [products]
  );

  useEffect(() => {
    setPriceCap(maxPrice);
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    const categoryFiltered = selectedCategories.length
      ? products.filter((product) => selectedCategories.includes(product.category))
      : products;

    const priceFiltered = categoryFiltered.filter(
      (product) => product.price <= priceCap
    );

    if (sortOrder === "desc") {
      return [...priceFiltered].sort((a, b) => b.price - a.price);
    }

    if (sortOrder === "asc") {
      return [...priceFiltered].sort((a, b) => a.price - b.price);
    }

    return priceFiltered;
  }, [priceCap, products, selectedCategories, sortOrder]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const handleAddToCart = async (product: Product) => {
    setActiveCartId(product.id);
    await addToCart(product);
    toast.success(`${product.title} added to cart`);

    window.setTimeout(() => {
      setActiveCartId((current) => (current === product.id ? null : current));
    }, 900);
  };

  const handleWishlist = async (product: Product) => {
    const wasFavorite = favoriteProduct.some((item) => item.id === product.id);

    setActiveWishlistId(product.id);
    await addToFavorite(product);
    toast.success(
      wasFavorite
        ? `${product.title} removed from wishlist`
        : `${product.title} added to wishlist`
    );

    window.setTimeout(() => {
      setActiveWishlistId((current) => (current === product.id ? null : current));
    }, 900);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#f3f4f6] px-4 py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-12 w-96 animate-pulse rounded-xl bg-white" />
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="h-[420px] animate-pulse rounded-2xl bg-white" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-[#f3f4f6] px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-white p-8 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[#f3f4f6] px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl bg-white px-6 py-8 text-center shadow-sm">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-6xl">
            Discover Our Exquisite Collection
          </h1>
          <p className="mt-3 text-sm text-gray-600 md:text-base">
            Browse every product, refine by category, and narrow the price range.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-950">Filters</h2>

            <div className="mt-8 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Category</h3>
                <div className="mt-4 space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 text-sm text-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-5 w-5 rounded border border-gray-300"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategories([])}
                    className="mt-4 text-sm font-semibold text-amazonBlue hover:text-amazonOrange"
                  >
                    Show all categories
                  </button>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900">Price Range</h3>
                <div className="mt-4 space-y-4">
                  <label className="flex items-center gap-3 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={sortOrder === "desc"}
                      onChange={() =>
                        setSortOrder((current) =>
                          current === "desc" ? "default" : "desc"
                        )
                      }
                      className="h-5 w-5 rounded border border-gray-300"
                    />
                    <span>High to Low</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={sortOrder === "asc"}
                      onChange={() =>
                        setSortOrder((current) =>
                          current === "asc" ? "default" : "asc"
                        )
                      }
                      className="h-5 w-5 rounded border border-gray-300"
                    />
                    <span>Low to High</span>
                  </label>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={1}
                      value={[priceCap]}
                      onValueChange={(value) => setPriceCap(value[0] ?? maxPrice)}
                    />
                    <p className="mt-3 text-sm font-medium text-gray-700">
                      Up to ${priceCap.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 rounded-2xl bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-950">
                  {filteredProducts.length}
                </span>{" "}
                of {products.length} products
              </p>
              <p className="text-sm text-gray-500">
                {selectedCategories.length
                  ? `Filtered by ${selectedCategories.join(", ")}`
                  : "All categories"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const isFavorite = favoriteProduct.some(
                  (item) => item.id === product.id
                );

                return (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                        {Math.max(product.discountPercentage, 5).toFixed(2)}%
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleWishlist(product);
                        }}
                        className={`rounded-full p-2 transition ${
                          activeWishlistId === product.id || isFavorite
                            ? "bg-rose-100 text-rose-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        aria-label="Add to wishlist"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <path d="m12 21-1.45-1.32C5.4 15.02 2 11.94 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.44-3.4 6.52-8.55 11.18z" />
                        </svg>
                      </button>
                    </div>

                    <div className="relative h-64 overflow-hidden rounded-xl bg-gray-50">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-contain p-4 transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-4 space-y-3">
                      <h3 className="text-2xl font-semibold text-gray-950 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-lg text-gray-600 line-clamp-3">
                        {product.description}
                      </p>
                      <p className="text-3xl font-bold text-gray-950">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-lg text-gray-700">
                        Category:{" "}
                        <span className="font-semibold lowercase">
                          {product.category}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleAddToCart(product);
                        }}
                        className={`w-full rounded-full px-5 py-3 text-xl font-semibold transition ${
                          activeCartId === product.id
                            ? "bg-green-400 text-black shadow-lg shadow-green-200"
                            : "border border-gray-400 bg-white text-gray-950 hover:bg-gray-50"
                        }`}
                      >
                        {activeCartId === product.id ? "Added to cart" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
