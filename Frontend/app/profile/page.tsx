"use client";

import { logo } from "@/assets";
import { buildAuthPath } from "@/lib/authRedirect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/useStore";

export default function ProfilePage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  if (!isLoggedIn || !user) {
    return (
      <div className="bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="bg-amazonBlue w-28 p-2 rounded-sm mx-auto">
            <Image src={logo} alt="Amazon Logo" width={180} height={100} />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Your account
          </h2>
          <p className="text-sm text-gray-600">
            Please sign in to view your profile details.
          </p>
          <button
            type="button"
            onClick={() => router.push(buildAuthPath("/login", "/profile"))}
            className="mt-4 inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-sm text-white bg-amazonOrange hover:bg-amazonOrangeDark"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="bg-amazonBlue w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Your Account
            </h2>
            <p className="text-sm text-gray-600">
              View and edit your profile information.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-md p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Account details
            </h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
          <div className="border border-gray-200 rounded-md p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Orders &amp; preferences
            </h3>
            <p className="text-sm text-gray-700">
              View your{" "}
              <button
                type="button"
                onClick={() => router.push("/orders")}
                className="text-amazonBlue hover:text-amazonOrangeDark underline"
              >
                Orders
              </button>{" "}
              or manage your shopping experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
