"use client";

import { paymentImage } from "@/assets";
import { useStore } from "@/lib/useStore";
import type { Product } from "@/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, ShieldCheck, Star, Truck } from "lucide-react";
import { useState } from "react";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const addToCart = useStore((state) => state.addToCart);
  const addToFavorite = useStore((state) => state.addToFavorite);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(
    product.thumbnail || product.images[0] || ""
  );

  const allImages = [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...product.images,
  ].filter((image, index, images) => image && images.indexOf(image) === index);

  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : product.price + 20;

  const savings = Math.max(originalPrice - product.price, 0);
  const isInStock = product.stock > 0;

  const handleBuyNow = async () => {
    await addToCart(product);
    router.push("/cart");
  };

  return (
    <div className="bg-[#f3f4f6] min-h-[40vh] px-4 py-8 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[88px_minmax(0,0.9fr)_minmax(340px,1fr)]">
        <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
          {allImages.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`relative h-20 w-20 overflow-hidden rounded-md border bg-white transition ${
                selectedImage === image
                  ? "border-amazonOrange shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={image}
                alt={product.title}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>

        <div className="order-1 rounded-2xl bg-[#ececec] p-4 lg:order-2 lg:p-6">
          <div className="relative mx-auto aspect-square max-w-lg">
            <Image
              src={selectedImage || product.thumbnail}
              alt={product.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="order-3 space-y-5">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1 text-amazonOrange">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < Math.round(product.rating || 4)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-semibold text-gray-950">
                ({(product.rating || 4.3).toFixed(1)} reviews)
              </span>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-gray-950">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-2xl text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-2xl text-gray-900">
              <Eye className="h-5 w-5" />
              <span>
                <strong>250+</strong> people are viewing this right now
              </span>
            </div>

            <p className="text-2xl text-gray-900">
              You are saving{" "}
              <span className="font-semibold text-green-500">
                ${savings.toFixed(2)}
              </span>{" "}
              upon purchase
            </p>
          </div>

          <div className="space-y-4 text-lg leading-8 text-gray-800">
            <p>{product.description}</p>
            <p>{product.warrantyInformation || "3 year warranty"}</p>
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    isInStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isInStock ? "In Stock" : "Out of Stock"}
                </span>
                <span className="text-base text-gray-600">
                  {isInStock
                    ? `${product.stock} units available`
                    : "Currently unavailable"}
                </span>
              </div>
            </div>
            <p>
              Brand: <span className="font-semibold">{product.brand}</span>
            </p>
            <p>
              Category: <span className="font-semibold">{product.category}</span>
            </p>
            <p>
              Tags:{" "}
              <span className="font-semibold">
                {product.tags.length ? product.tags.join(", ") : product.category}
              </span>
            </p>
            <p>
              Availability:{" "}
              <span className="font-semibold">{product.availabilityStatus}</span>
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void addToCart(product)}
                disabled={!isInStock}
                className="w-full rounded-2xl border border-gray-400 bg-white px-6 py-4 text-xl font-semibold tracking-wide text-gray-950 transition hover:border-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
              >
                ADD TO CART
              </button>
              <button
                type="button"
                onClick={() => void handleBuyNow()}
                disabled={!isInStock}
                className="w-full rounded-2xl bg-amazonOrange px-6 py-4 text-xl font-semibold tracking-wide text-black transition hover:bg-amazonOrangeDark disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                BUY NOW
              </button>
            </div>
            <button
              type="button"
              onClick={() => void addToFavorite(product)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-6 py-4 text-base font-medium text-gray-800 transition hover:bg-gray-200"
            >
              Add to Wishlist
            </button>
          </div>

          <div className="rounded-2xl bg-[#ececec] p-6 text-center">
            <div className="relative mx-auto h-10 w-full max-w-sm">
              <Image
                src={paymentImage}
                alt="Payment methods"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-5 text-2xl font-semibold text-gray-950">
              Guaranteed safe & secure checkout
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-amazonBlue" />
              <span>{product.shippingInformation}</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>{product.returnPolicy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
