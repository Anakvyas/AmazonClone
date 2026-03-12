"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import SideNavbar from "./SideNavbar";

const HeaderBottom = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="bg-amazonLight text-white/80">
      <div className="flex items-center space-x-3 overflow-x-auto px-3 py-2 text-sm md:pl-6">
        <button className="link flex items-center" onClick={toggleSidebar}>
          <Menu className="text-xl mr-1" />
          All
        </button>

        <p className="link">Today&apos;s Deals</p>
        <p className="link">Customer Service</p>
        <p className="link hidden md:inline-flex">Registry</p>
        <p className="link hidden md:inline-flex">Gift Cards</p>
        <p className="link hidden md:inline-flex">Sell</p>
        <Link href="/products" className="link">
          All Products
        </Link>
      </div>
      <SideNavbar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default HeaderBottom;
