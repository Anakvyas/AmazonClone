import Link from "next/link";

interface OrderConfirmationPageProps {
  searchParams?: Promise<{
    orderId?: string;
  }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const orderId = params?.orderId;

  return (
    <div className="min-h-[60vh] bg-white px-4 py-14">
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
          Order confirmed
        </p>
        <h1 className="mt-3 text-4xl font-bold text-gray-950">
          Thank you for your purchase
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Your order has been placed successfully.
        </p>

        <div className="mt-8 rounded-2xl border border-green-200 bg-white p-5">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="mt-2 text-3xl font-bold text-gray-950">
            #{orderId ?? "Pending"}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/orders"
            className="rounded-full bg-amazonOrange px-6 py-3 text-sm font-semibold text-black transition hover:bg-amazonOrangeDark"
          >
            View your orders
          </Link>
          <Link
            href="/"
            className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
