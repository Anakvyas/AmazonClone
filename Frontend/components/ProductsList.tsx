"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/useStore";
import { BackendProduct, getProducts, mapBackendProductToUi } from "@/service/api";

const ProductsList = () => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useStore((state) => state.addToCart);
  const addToFavorite = useStore((state) => state.addToFavorite);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load products.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-600">
        Loading products from backend...
      </div>
    );
  }

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
  );
};

export default ProductsList;
