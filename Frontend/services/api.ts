import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api"
})

export const getProducts = async () => {
  const res = await API.get("/products")
  return res.data
}

export const getProductsByCategory = async (category:string) => {
  const res = await API.get(`/products?category=${category}`)
  return res.data
}

export default API