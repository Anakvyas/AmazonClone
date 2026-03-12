export interface ProductImage {
  url: string
}

export interface Product {
  id: number
  name: string
  price: number
  description?: string
  images?: ProductImage[]
}