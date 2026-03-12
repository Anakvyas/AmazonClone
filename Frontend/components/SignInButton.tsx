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
      className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]"
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
