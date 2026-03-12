"use client";

import { logo } from "@/assets";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useStore } from "@/lib/useStore";
import toast from "react-hot-toast";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      const message = "Please enter email and password.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      await login({
        email,
        password,
      });
      toast.success("Signed in successfully.");
      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign in. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="bg-amazonBlue w-28 p-2 rounded-sm mx-auto">
            <Image src={logo} alt="Amazon Logo" width={180} height={100} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            to continue shopping on Amazon clone
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white border border-gray-200 rounded-md p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-sm border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-sm border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600" aria-live="polite">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-amazonOrange hover:bg-amazonOrangeDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazonOrangeDark"
          >
            Sign in
          </button>
          <GoogleAuthButton mode="login" />
          <p className="text-xs text-gray-600">
            By continuing, you agree to the Amazon clone&apos;s Conditions of
            Use and Privacy Notice.
          </p>
          <div className="pt-4 border-t border-gray-200 text-center text-sm">
            <p className="text-gray-600 mb-2">New to Amazon?</p>
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-sm text-gray-800 bg-gray-50 hover:bg-gray-100"
            >
              Create your Amazon account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
