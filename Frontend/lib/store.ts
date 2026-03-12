import { Product } from "@/type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as api from "@/service/api";

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface StoreType {
  // auth (client-only)
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  signup: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  // cart
  cartProduct: Product[];
  addToCart: (product: Product) => Promise<void>;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  resetCart: () => void;
  // favorite
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: number) => void;
  resetFavorite: () => void;
}

export const store = create<StoreType>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: async ({ email, password }) => {
        const auth = await api.loginUser({ email, password });

        set({
          user: {
            id: auth.id,
            name: auth.name,
            email: auth.email,
          },
          token: auth.token,
          isLoggedIn: true,
        });
      },
      googleLogin: async (credential: string) => {
        const auth = await api.loginWithGoogle(credential);

        set({
          user: {
            id: auth.id,
            name: auth.name,
            email: auth.email,
          },
          token: auth.token,
          isLoggedIn: true,
        });
      },
      signup: async ({ name, email, password }) => {
        const auth = await api.registerUser({ name, email, password });

        set({
          user: {
            id: auth.id,
            name: auth.name,
            email: auth.email,
          },
          token: auth.token,
          isLoggedIn: true,
        });
      },
      logout: () =>
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        }),
      cartProduct: [],
      favoriteProduct: [],
      addToCart: (product: Product) => {
        return new Promise<void>((resolve) => {
          const state = get();

          if (state.token) {
            void api
              .addToCart({
                productId: product.id,
                quantity: 1,
                token: state.token,
              })
              .catch(() => {
                // Ignore backend failures for local UX; UI stays responsive.
              });
          }

          set((state: StoreType) => {
            const existingProduct = state.cartProduct.find(
              (p) => p.id === product.id
            );

            if (existingProduct) {
              return {
                cartProduct: state.cartProduct.map((p) =>
                  p.id === product.id
                    ? { ...p, quantity: (p.quantity || 0) + 1 }
                    : p
                ),
              };
            } else {
              return {
                cartProduct: [
                  ...state.cartProduct,
                  { ...product, quantity: 1 },
                ],
              };
            }
          });
          resolve();
        });
      },
      decreaseQuantity: (productId: number) => {
        set((state: StoreType) => {
          const existingProduct = state.cartProduct.find(
            (p) => p.id === productId
          );

          if (existingProduct) {
            const nextQuantity = (existingProduct.quantity ?? 1) - 1;

            return {
              cartProduct:
                nextQuantity <= 0
                  ? state.cartProduct.filter((p) => p.id !== productId)
                  : state.cartProduct.map((p) =>
                      p.id === productId
                        ? { ...p, quantity: nextQuantity }
                        : p
                    ),
            };
          } else {
            return state;
          }
        });
      },
      removeFromCart: (productId: number) => {
        set((state: StoreType) => ({
          cartProduct: state.cartProduct.filter(
            (item) => item.id !== productId
          ),
        }));
      },
      resetCart: () => {
        set({ cartProduct: [] });
      },
      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          const state = get();

          if (state.token) {
            void api
              .addToWishlist({
                productId: product.id,
                token: state.token,
              })
              .catch(() => {
                // Ignore backend failures; local toggle still works.
              });
          }

          set((state: StoreType) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item.id === product.id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter((item) => item.id !== product.id)
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: number) => {
        set((state: StoreType) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item.id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "store-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
