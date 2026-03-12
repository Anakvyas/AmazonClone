"use client";

import React from "react";
import { BiCaretDown } from "react-icons/bi";
import { useRouter } from "next/navigation";

const SignInButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <button
      onClick={handleClick}
      className="hidden h-[70%] cursor-pointer flex-col justify-center border border-transparent px-2 text-xs text-gray-100 duration-300 hover:border-white md:flex"
    >
      <span className="text-left text-white font-semibold md:text-gray-100 md:font-normal">
        Hello, sign in
      </span>
      <span className="text-white font-bold hidden md:flex items-center">
        Account & Lists{" "}
        <span>
          <BiCaretDown />
        </span>
      </span>
    </button>
  );
};

export default SignInButton;
