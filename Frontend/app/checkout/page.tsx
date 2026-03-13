"use client";

import { buildAuthPath } from "@/lib/authRedirect";
import { createOrder } from "@/service/api";
import { useStore } from "@/lib/useStore";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const initialAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const cartProduct = useStore((state) => state.cartProduct);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const token = useStore((state) => state.token);
  const resetCart = useStore((state) => state.resetCart);
  const user = useStore((state) => state.user);

  const [shipping, setShipping] = useState<ShippingAddress>({
    ...initialAddress,
    fullName: user?.name ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartProduct.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const itemCount = cartProduct.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const shippingFee: number = 0;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(buildAuthPath("/login", "/checkout"));
      return;
    }

    if (!cartProduct.length) {
      router.replace("/cart");
    }
  }, [cartProduct.length, isLoggedIn, router]);

  useEffect(() => {
    if (user?.name) {
      setShipping((current) => ({
        ...current,
        fullName: current.fullName || user.name,
      }));
    }
  }, [user?.name]);

  const handleChange = (
    field: keyof ShippingAddress,
    value: ShippingAddress[keyof ShippingAddress]
  ) => {
    setShipping((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      router.replace(buildAuthPath("/login", "/checkout"));
      return;
    }

    const requiredFields: Array<keyof ShippingAddress> = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    const missingField = requiredFields.some((field) => !shipping[field].trim());

    if (missingField) {
      const message = "Please complete the shipping address form.";
      setError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);

    try {
      const items = cartProduct.map((item) => ({
        productId: item.id,
        quantity: item.quantity || 1,
      }));

      const result = await createOrder({ items, token });
      resetCart();
      toast.success(`Order #${result.orderId} placed successfully.`);
      router.push("/orders");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to place order. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] bg-gray-100 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,2fr),minmax(320px,1fr)]">
        <form
          onSubmit={handlePlaceOrder}
          className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amazonBlue">
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Shipping address
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your delivery details and review your order before placing it.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-700">
              <span>Full name</span>
              <input
                value={shipping.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amazonOrange"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              <span>Phone number</span>
              <input
                value={shipping.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amazonOrange"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700 md:col-span-2">
              <span>Address line 1</span>
              <input
                value={shipping.addressLine1}
                onChange={(event) =>
                  handleChange("addressLine1", event.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amazonOrange"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700 md:col-span-2">
              <span>Address line 2</span>
              <input
                value={shipping.addressLine2}
                onChange={(event) =>
                  handleChange("addressLine2", event.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amazonOrange"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              <span>City</span>
              <input
                value={shipping.city}
                onChange={(event) => handleChange("city", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amazonOrange"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              <span>State</span>
              <input
                value={shipping.state}
                onChange={(event) => handleChange("state", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amazonOrange"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              <span>Postal code</span>
              <input
                value={shipping.postalCode}
                onChange={(event) =>
                  handleChange("postalCode", event.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amazonOrange"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              <span>Country</span>
              <input
                value={shipping.country}
                onChange={(event) => handleChange("country", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amazonOrange"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="text-lg font-semibold text-gray-950">Review items</h2>
            <div className="mt-4 space-y-3">
              {cartProduct.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-gray-500">
                      Qty {item.quantity || 1} x ${(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !cartProduct.length}
            className="w-full rounded-full bg-amazonOrange px-6 py-3 text-sm font-semibold text-black transition hover:bg-amazonOrangeDark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-950">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Items ({itemCount})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-950">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Orders can only be placed by signed-in users. Your current cart
            items will be converted into an order after confirmation.
          </div>
        </aside>
      </div>
    </div>
  );
}
