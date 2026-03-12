"use client";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/type";
import CategoryListView from "./CategoryListView";
import { getProducts, mapBackendProductToUi } from "@/service/api";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") ?? "All"
  );
  const [isInputFocused, setIsInputFocused] = useState(false); // New state to manage input focus
  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref to detect clicks outside

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const updateSearchRoute = (nextSearch: string, nextCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    } else {
      params.delete("search");
    }

    if (nextCategory !== "All") {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await getProducts({ page: 1, limit: 50 });
        if (!isMounted) return;
        const mapped = response.items.map(mapBackendProductToUi);
        setProducts(mapped);
      } catch {
        // Swallow errors – search is a convenience feature.
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const filtered = products.filter((item: Product) =>
      item?.title.toLocaleLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || item.category === selectedCategory)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products, selectedCategory]);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") ?? "");
    setSelectedCategory(searchParams.get("category") ?? "All");
  }, [searchParams]);
  // Effect to detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false); // Hide the list if clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchContainerRef}
      className="flex-1 h-10 mx-4 flex items-center justify-between relative"
    >
      <CategoryListView
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          updateSearchRoute(searchQuery, category);
        }}
      />
      <input
        className="w-full h-full rounded-tr-md rounded-br-md px-2 placeholder:text-sm text-base text-black placeholder:text-black/70 border-[3px] border-transparent outline-none focus-visible:border-amazonOrange"
        type="text"
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
        placeholder="Search amazon"
        onFocus={() => setIsInputFocused(true)} // Set focus state
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            updateSearchRoute(searchQuery, selectedCategory);
            setIsInputFocused(false);
          }
        }}
      />
      {searchQuery && (
        <MdOutlineClose
          onClick={() => {
            setSearchQuery("");
            updateSearchRoute("", selectedCategory);
          }}
          className="text-xl text-amazonLight hover:text-red-600 absolute right-14 duration-200 cursor-pointer"
        />
      )}
      <button
        type="button"
        onClick={() => {
          updateSearchRoute(searchQuery, selectedCategory);
          setIsInputFocused(false);
        }}
        className="w-12 h-full bg-amazonOrange hover:bg-amazonOrangeDark duration-200 cursor-pointer text-black text-2xl flex items-center justify-center absolute right-0 rounded-tr-md rounded-br-md"
      >
        <HiOutlineSearch />
      </button>
      {/*  ============= Searchfield start here ========== */}
      {isInputFocused && searchQuery && (
        <div className="absolute left-0 top-12 w-full mx-auto h-auto max-h-96 bg-white rounded-md overflow-y-scroll cursor-pointer text-black">
          {filteredProducts?.length > 0 ? (
            <div className="flex flex-col">
              {filteredProducts?.map((item: Product) => (
                <Link
                  key={item?.id}
                  href={{
                    pathname: `/product/${item?.id}`,
                    query: { id: item?.id },
                  }}
                  onClick={() => setSearchQuery("")}
                  className="flex items-center gap-x-2 text-base font-medium hover:bg-lightText/30 px-3 py-1.5"
                >
                  <CiSearch className="text-lg" />
                  <span className="flex-1">{item?.title}</span>
                  <span className="text-xs capitalize text-gray-500">
                    {item.category}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 px-5">
              <p className="text-base">
                Nothing matched with{" "}
                <span className="font-semibold underline underline-offset-2 decoration-[1px]">
                  {searchQuery}
                </span>{" "}
                in {selectedCategory === "All" ? "all categories" : selectedCategory}.
              </p>
            </div>
          )}
        </div>
      )}

      {/*  ============= Searchfield end here ============ */}
    </div>
  );
};

export default SearchInput;
