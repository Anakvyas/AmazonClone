import React from "react";
import Link from "next/link";
import { logo } from "@/assets";
import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] bg-[radial-gradient(circle_at_top,_#fff7dc,_#f3f4f6_45%,_#e5e7eb_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="order-2 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur lg:order-1">
          <div className="inline-flex rounded-2xl border border-amazonBlue/10 bg-amazonBlue px-5 py-3 shadow-sm">
            <Image src={logo} alt="Amazon Logo" width={170} height={90} />
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-amazonBlue">
            Error 404
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950 md:text-6xl">
            This aisle is empty.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
            The page you tried to open doesn&apos;t exist anymore or the link was
            incorrect. Head back to the storefront and keep browsing.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-w-[210px] items-center justify-center rounded-full bg-amazonOrange px-6 py-3 text-sm font-semibold text-black transition hover:bg-amazonOrangeDark"
            >
              Return to homepage
            </Link>
            <Link
              href="/help"
              className="inline-flex min-w-[210px] items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Visit help center
            </Link>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-600">
            Need help right now? Go to the{" "}
            <Link
              href="/help"
              className="font-semibold text-amazonBlue hover:text-amazonOrange"
            >
              Help section
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="font-semibold text-amazonBlue hover:text-amazonOrange"
            >
              contact us
            </Link>
            .
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-[#111827] p-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.2),_transparent_35%)]" />
            <div className="relative">
              <div className="text-[7rem] font-black leading-none text-white/10 md:text-[10rem]">
                404
              </div>
              <div className="-mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.35em] text-white/50">
                  Navigation Tip
                </p>
                <p className="mt-4 text-2xl font-bold">
                  Try searching from the top bar or open All Products.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                      Quick link
                    </p>
                    <p className="mt-2 text-lg font-semibold">All Products</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                      Quick link
                    </p>
                    <p className="mt-2 text-lg font-semibold">Orders & Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
