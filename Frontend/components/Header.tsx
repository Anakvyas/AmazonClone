import { logo } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SlLocationPin } from "react-icons/sl";
import CartButton from "./CartButton";
import FavoriteButton from "./FavoriteButton";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";
import HeaderBottom from "./HeaderBottom";
import SearchInput from "./SearchInput";
import OrderBtn from "./OrderBtn";

const Header = () => {
  return (
    <header className="bg-transparent sticky top-0 z-50">
      <div className="w-full bg-amazonBlue text-lightText sticky top-0 z-50">
        <div className="mx-auto flex w-full flex-wrap items-center gap-3 px-3 py-3 md:h-20 md:flex-nowrap md:justify-between md:px-4">
          {/* Logo */}
          <Link href={"/"}>
            <div className="headerItem">
              <Image
                className="w-28 object-cover mt-1"
                src={logo}
                alt="logo"
                priority
              />
            </div>
          </Link>
          {/* Deliver */}
          <div className="headerItem hidden xl:inline-flex gap-1">
            <SlLocationPin className="text-lg text-white" />
            <div className="text-xs">
              <p>Deliver to</p>
              <p className="text-white font-bold uppercase">India</p>
            </div>
          </div>
          <Suspense fallback={<div className="flex-1 h-10 mx-4 rounded-md bg-white/10" />}>
            <SearchInput />
          </Suspense>

          <SignOutButton />
          <SignInButton />

          {/* Favorite */}
          <FavoriteButton />
          {/* Cart */}
          <CartButton />
          <OrderBtn />
        </div>
      </div>
      <HeaderBottom />
    </header>
  );
};

export default Header;
