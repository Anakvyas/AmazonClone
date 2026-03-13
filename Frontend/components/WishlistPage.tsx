"use client";

import { buildAuthPath } from "@/lib/authRedirect";
import { useStore } from "@/lib/useStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const router = useRouter();
  const favoriteProduct = useStore((state) => state.favoriteProduct);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromFavorite = useStore((state) => state.removeFromFavorite);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  const handleMoveToCart = async (productId: number) => {
    const product = favoriteProduct.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    await addToCart(product);
    toast.success(`${product.title} added to cart`);
  };

  if (!favoriteProduct.length) {
    return (
      <div className="min-h-[60vh] bg-[#f6f7fb] px-4 py-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[28px] border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-4xl">
            ❤
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Your wishlist is empty
          </h1>
          <p className="mt-3 max-w-lg text-sm text-gray-600">
            Save products you love and come back to them later. Your favorite
            items will appear here in a clean saved-items view.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-amazonOrange px-6 py-3 text-sm font-semibold text-black transition hover:bg-amazonOrangeDark"
            >
              Continue shopping
            </Link>
            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => router.push(buildAuthPath("/login", "/wishlist"))}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[#f6f7fb] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[28px] bg-white px-6 py-7 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amazonBlue">
                Saved Items
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                Your Wishlist
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Review saved products, move them to cart, or open each item for
                full details.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f6f7fb] px-4 py-3 text-sm text-gray-700">
              <span className="font-semibold text-gray-950">
                {favoriteProduct.length}
              </span>{" "}
              saved item{favoriteProduct.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favoriteProduct.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <button
                type="button"
                onClick={() => router.push(`/product/${item.id}`)}
                className="block w-full cursor-pointer text-left"
              >
                <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#f8f8f8] p-6">
                  {(item.thumbnail || item.images?.[0]) && (
                    <Image
                      src={item.thumbnail || item.images[0]}
                      alt={item.title}
                      fill
                      className="object-contain p-6 transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
              </button>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/product/${item.id}`)}
                    className="cursor-pointer text-left"
                  >
                    <h2 className="line-clamp-2 text-xl font-semibold text-gray-950 transition group-hover:text-amazonBlue">
                      {item.title}
                    </h2>
                  </button>
                  <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-medium ${
                      item.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.stock > 0 ? `In stock: ${item.stock}` : "Out of stock"}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-gray-950">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromFavorite(item.id)}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void handleMoveToCart(item.id)}
                    disabled={item.stock <= 0}
                    className="rounded-full bg-amazonOrange px-4 py-3 text-sm font-semibold text-black transition hover:bg-amazonOrangeDark disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/product/${item.id}`)}
                    className="rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
