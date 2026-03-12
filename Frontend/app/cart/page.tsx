"use client";

import { useStore } from "@/lib/useStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const cartProduct = useStore((state) => state.cartProduct);
  const decreaseQuantity = useStore((state) => state.decreaseQuantity);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const resetCart = useStore((state) => state.resetCart);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  const total = cartProduct.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const itemCount = cartProduct.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!cartProduct.length) return;
    router.push("/checkout");
  };

  if (cartProduct.length === 0) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Amazon Cart is empty
          </h1>
          <p className="text-sm text-gray-600">
            Check your Saved for later items below or{" "}
            <Link href="/" className="text-amazonBlue hover:text-amazonOrange">
              continue shopping
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[60vh] px-4 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-6">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Shopping Cart</h1>
          <p className="text-xs text-gray-500 text-right mb-4">Price</p>
          <div className="space-y-4">
            {cartProduct.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row gap-4 border-b border-gray-200 pb-4"
              >
                {(item.thumbnail || item.images?.[0]) && (
                  <div className="w-32 flex items-center justify-center">
                    <Image
                      src={item.thumbnail || item.images[0]}
                      alt={item.title || "Product image"}
                      width={200}
                      height={200}
                      className="object-contain max-h-32"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <h2 className="text-sm md:text-base font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span>
                      Qty:{" "}
                      <span className="font-semibold">
                        {item.quantity || 1}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      className="text-amazonBlue hover:text-amazonOrange text-xs"
                    >
                      {item.quantity === 1 ? "Remove" : "-"}
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="text-amazonBlue hover:text-amazonOrange text-xs"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-amazonBlue hover:text-amazonOrange text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-semibold text-gray-900">
                  ${(item.price || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={resetCart}
              className="text-sm text-amazonBlue hover:text-amazonOrange"
            >
              Clear cart
            </button>
            <p className="text-sm">
              Subtotal ({itemCount} items):{" "}
              <span className="font-bold">
                ${total.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm h-fit">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-base font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="w-full mt-2 py-2 px-4 text-sm font-medium rounded-full bg-amazonOrange hover:bg-amazonOrangeDark disabled:opacity-60 disabled:cursor-not-allowed text-black"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
