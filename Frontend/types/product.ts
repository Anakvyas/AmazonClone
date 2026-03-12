export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  brand?: string;
  rating?: number;
  stock?: number;
  thumbnail?: string;
  images?: string[];
  quantity?: number;
}
