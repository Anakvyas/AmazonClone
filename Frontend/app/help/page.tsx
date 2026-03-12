import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="bg-white min-h-[60vh] px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Help &amp; Support</h1>
        <p className="text-sm text-gray-700">
          This is a learning Amazon clone built with Next.js and Tailwind CSS.
          Use this page as a starting point for help and FAQs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-md p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Your Orders
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              Track or view your recent orders in this demo.
            </p>
            <Link
              href="/orders"
              className="text-sm text-amazonBlue hover:text-amazonOrange"
            >
              Go to Your Orders
            </Link>
          </div>
          <div className="border border-gray-200 rounded-md p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Your Account
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              Manage your profile details and preferences.
            </p>
            <Link
              href="/profile"
              className="text-sm text-amazonBlue hover:text-amazonOrange"
            >
              Go to Your Account
            </Link>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Note: This project is for educational purposes only and does not
          process real orders or payments.
        </p>
      </div>
    </div>
  );
}

