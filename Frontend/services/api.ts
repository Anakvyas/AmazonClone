import axios from "axios";
import { Product } from "@/types/product";

const API = axios.create({
  baseURL: "/api",
});

const normalizeProduct = (product: Record<string, unknown>): Product => {
  const productImages = Array.isArray(product.images)
    ? product.images.filter((image): image is string => typeof image === "string")
    : [];

  return {
    id: Number(product.id ?? 0),
    title: String(product.title ?? product.name ?? ""),
    description: String(product.description ?? ""),
    category: String(product.category ?? "all"),
    price: Number(product.price ?? 0),
    brand: product.brand ? String(product.brand) : undefined,
    rating: typeof product.rating === "number" ? product.rating : undefined,
    stock: typeof product.stock === "number" ? product.stock : undefined,
    thumbnail:
      typeof product.thumbnail === "string"
        ? product.thumbnail
        : typeof product.image === "string"
          ? product.image
          : productImages[0],
    images: productImages,
  };
};

const normalizeProductsResponse = (payload: unknown): Product[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizeProduct(item as Record<string, unknown>));
  }

  if (payload && typeof payload === "object") {
    const data = payload as {
      products?: unknown;
      data?: unknown;
      items?: unknown;
    };
    const collection = data.products ?? data.data ?? data.items;

    if (Array.isArray(collection)) {
      return collection.map((item) =>
        normalizeProduct(item as Record<string, unknown>)
      );
    }
  }

  return [];
};

export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get("/products");
  return normalizeProductsResponse(res.data);
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const res = await API.get("/products", {
    params: category && category !== "all" ? { category } : undefined,
  });
  return normalizeProductsResponse(res.data);
};

export default API;
