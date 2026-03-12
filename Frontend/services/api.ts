import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000/api"
})

export const getProductsByCategory = (category: string) =>
  api.get(`/products?category=${category}`)

export default api