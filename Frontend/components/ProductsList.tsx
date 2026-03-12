"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { getProducts } from "@/services/api";
import CardButton from "./CardButton";

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.warn("Unexpected API response:", data);
          setProducts([]);
        }

      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("Unable to load products right now.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-gray-600">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          {/* Product Image */}
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">

            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title ?? "product image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No image
              </div>
            )}

          </div>

          {/* Category */}
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
            {product.category ?? "Unknown"}
          </p>

          {/* Title */}
          <h2 className="line-clamp-2 min-h-12 text-base font-semibold text-gray-900">
            {product.title}
          </h2>

          {/* Description */}
          <p className="mt-2 line-clamp-3 min-h-18 text-sm text-gray-600">
            {product.description}
          </p>

          {/* Price + Stock */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${product.price?.toFixed(2)}
            </span>

            <span className="text-xs text-gray-500">
              {product.stock ?? 0} in stock
            </span>
          </div>

          {/* Button */}
          <div className="mt-4">
            <CardButton product={product} />
          </div>

        </article>
      ))}
    </div>
  );
};

export default ProductsList;