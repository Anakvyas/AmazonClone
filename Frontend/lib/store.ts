import { Product } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreType {
  cartProduct: Product[];
  favoriteProduct: Product[];
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  resetCart: () => void;
  addToFavorite: (product: Product) => void;
  removeFromFavorite: (productId: number) => void;
  resetFavorite: () => void;
}

export const useStore = create<StoreType>()(
  persist(
    (set) => ({
      cartProduct: [],
      favoriteProduct: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cartProduct.find((item) => item.id === product.id);

          if (existing) {
            return {
              cartProduct: state.cartProduct.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                  : item
              ),
            };
          }

          return {
            cartProduct: [...state.cartProduct, { ...product, quantity: 1 }],
          };
        }),
      decreaseQuantity: (productId) =>
        set((state) => ({
          cartProduct: state.cartProduct.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max((item.quantity ?? 1) - 1, 1) }
              : item
          ),
        })),
      removeFromCart: (productId) =>
        set((state) => ({
          cartProduct: state.cartProduct.filter((item) => item.id !== productId),
        })),
      resetCart: () => set({ cartProduct: [] }),
      addToFavorite: (product) =>
        set((state) => {
          const exists = state.favoriteProduct.some((item) => item.id === product.id);

          return {
            favoriteProduct: exists
              ? state.favoriteProduct.filter((item) => item.id !== product.id)
              : [...state.favoriteProduct, product],
          };
        }),
      removeFromFavorite: (productId) =>
        set((state) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item.id !== productId
          ),
        })),
      resetFavorite: () => set({ favoriteProduct: [] }),
    }),
    {
      name: "amazon-store",
    }
  )
);
