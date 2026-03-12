"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getProducts } from "@/services/api"
import { Product } from "@/types/product"

const ProductsList = () => {

  const [products,setProducts] = useState<Product[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const fetchProducts = async () => {

      try{

        const data = await getProducts()

        setProducts(data)

      }catch(error){

        console.error("Error fetching products",error)

      }finally{

        setLoading(false)

      }

    }

    fetchProducts()

  },[])

  if(loading){
    return <p className="text-center py-10">Loading products...</p>
  }

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {products?.map((product)=>{

        const img =
          product.images?.[0]?.url ||
          "https://placehold.co/300x200"

        return(

          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-white p-4 shadow hover:shadow-lg transition duration-200 group rounded"
          >

            <div className="w-full h-[200px] flex items-center justify-center">

              <Image
                src={img}
                alt={product.name}
                width={200}
                height={200}
                className="object-contain group-hover:scale-105 transition duration-200"
              />

            </div>

            <h3 className="text-sm mt-3 line-clamp-2 text-gray-800">
              {product.name}
            </h3>

            <p className="text-lg font-semibold mt-1 text-amazonBlue">
              ${product.price}
            </p>

          </Link>

        )

      })}

    </div>

  )
}

export default ProductsList