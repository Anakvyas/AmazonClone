"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/useStore";

const SignOutButton = () => {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const logout = useStore((state) => state.logout);

  if (!isLoggedIn || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]"
    >
      <span className="text-left text-white font-semibold md:text-gray-100 md:font-normal">
        Hello, {user.name}
      </span>
      <span className="text-white font-bold hidden md:flex items-center">
        Log out
      </span>
    </button>
  );
};

export default SignOutButton;
