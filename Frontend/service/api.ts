import type { Product } from "@/type";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  token?: string | null;
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

async function request<T>(
  path: string,
  {
    method = "GET",
    token,
    body,
    cache = "no-store",
    next,
  }: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  let json: ApiResponse<T>;

  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`Unexpected response from server (${res.status})`);
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }

  if (typeof json.data === "undefined" && (json as any).token === undefined) {
    throw new Error("Malformed response from server");
  }

  return (json.data as T) ?? (json as unknown as T);
}

// ========== Auth ==========

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  token: string;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const res = await request<{
    token: string;
    user: { id: number; username: string; email: string };
  }>("/api/auth/register", {
    method: "POST",
    body: {
      username: input.name,
      email: input.email,
      password: input.password,
    },
  });

  return {
    id: res.user.id,
    name: res.user.username,
    email: res.user.email,
    token: res.token,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const res = await request<{
    token: string;
    user: { id: number; username: string; email: string };
  }>("/api/auth/login", {
    method: "POST",
    body: input,
  });

  return {
    id: res.user.id,
    name: res.user.username,
    email: res.user.email,
    token: res.token,
  };
}

export async function loginWithGoogle(
  credential: string
): Promise<AuthUser> {
  const res = await request<{
    token: string;
    user: { id: number; username: string; email: string };
  }>("/api/auth/google", {
    method: "POST",
    body: { credential },
  });

  return {
    id: res.user.id,
    name: res.user.username,
    email: res.user.email,
    token: res.token,
  };
}

// ========== Products ==========

export interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: { id: number; url: string }[];
  category: {
    id: number;
    name: string;
  };
}

export interface ProductQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  items: BackendProduct[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export async function getProducts(
  query: ProductQuery = {},
  requestOptions: Pick<RequestOptions, "cache" | "next"> = {}
): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (typeof query.page === "number") params.set("page", String(query.page));
  if (typeof query.limit === "number") params.set("limit", String(query.limit));

  const qs = params.toString();
  const path = qs ? `/api/products?${qs}` : "/api/products";

  return request<ProductsResponse>(path, {
    method: "GET",
    cache: requestOptions.cache ?? "no-store",
    next: requestOptions.next,
  });
}

export async function getProductById(
  id: string | number,
  requestOptions: Pick<RequestOptions, "cache" | "next"> = {}
): Promise<BackendProduct> {
  return request<BackendProduct>(`/api/products/${id}`, {
    method: "GET",
    cache: requestOptions.cache ?? "no-store",
    next: requestOptions.next,
  });
}

// Optional helper if we want to map backend products
// into the richer UI Product type.
export function mapBackendProductToUi(p: BackendProduct): Product {
  return {
    id: p.id,
    title: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    images: p.images.map((img) => img.url),
    thumbnail: p.images[0]?.url || "",
    brand: p.category.name,
    availabilityStatus: p.stock > 0 ? "In Stock" : "Out of Stock",
    category: p.category.name,
    dimensions: { width: 0, height: 0, depth: 0 },
    discountPercentage: 0,
    rating: 0,
    minimumOrderQuantity: 1,
    returnPolicy: "Standard",
    reviews: [],
    shippingInformation: "Standard shipping",
    sku: String(p.id),
    tags: [],
    warrantyInformation: "Standard warranty",
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      barcode: String(p.id),
      qrCode: "",
    },
  };
}

// ========== Cart ==========

export interface CartItemDto {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: BackendProduct;
}

export async function getCart(token: string): Promise<CartItemDto[]> {
  return request<CartItemDto[]>("/api/cart", {
    method: "GET",
    token,
  });
}

export async function addToCart(params: {
  productId: number;
  quantity: number;
  token: string;
}): Promise<CartItemDto> {
  return request<CartItemDto>("/api/cart", {
    method: "POST",
    token: params.token,
    body: {
      productId: params.productId,
      quantity: params.quantity,
    },
  });
}

export async function removeFromCart(params: {
  id: number;
  token: string;
}): Promise<void> {
  await request<unknown>(`/api/cart/${params.id}`, {
    method: "DELETE",
    token: params.token,
  });
}

// ========== Wishlist ==========

export interface WishlistItemDto {
  id: number;
  userId: number;
  productId: number;
  product: BackendProduct;
}

export async function addToWishlist(params: {
  productId: number;
  token: string;
}): Promise<WishlistItemDto> {
  return request<WishlistItemDto>("/api/wishlist", {
    method: "POST",
    token: params.token,
    body: { productId: params.productId },
  });
}

export async function getWishlist(token: string): Promise<WishlistItemDto[]> {
  return request<WishlistItemDto[]>("/api/wishlist", {
    method: "GET",
    token,
  });
}

// ========== Orders ==========

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface OrderDto {
  id: number;
  userId: number;
  totalPrice: number;
  createdAt: string;
  items: {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: BackendProduct;
  }[];
}

export interface OrdersResponse {
  items: OrderDto[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export async function createOrder(params: {
  items: CreateOrderItemInput[];
  token: string;
}): Promise<{ orderId: number }> {
  return request<{ orderId: number }>("/api/orders", {
    method: "POST",
    token: params.token,
    body: { items: params.items },
  });
}

export async function getOrders(params: {
  token: string;
  page?: number;
  limit?: number;
}): Promise<OrdersResponse> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 5),
  });

  return request<OrdersResponse>(`/api/orders/history?${query.toString()}`, {
    method: "GET",
    token: params.token,
  });
}
