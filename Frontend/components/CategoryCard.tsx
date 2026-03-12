"use client"

import Image from "next/image"

interface Product {
  id: number
  name: string
  images?: { url: string }[]
}

interface Props {
  title: string
  products: Product[]
}

export default function CategoryCard({ title, products }: Props) {

  return (
    <div className="bg-white p-4 shadow-sm rounded">

      <h2 className="text-lg font-semibold mb-4">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-3">

        {Array.isArray(products) &&
          products.slice(0,4).map(product => {

            const img =
              product.images?.[0]?.url ||
              "https://placehold.co/300x200"

            return (

              <div key={product.id}>

                <Image
                  src={img}
                  alt={product.name}
                  width={150}
                  height={120}
                  className="object-cover w-full h-[110px]"
                />

                <p className="text-sm mt-1">
                  {product.name}
                </p>

              </div>

            )

          })}

      </div>

      <p className="text-blue-600 text-sm mt-3 cursor-pointer hover:underline">
        See more
      </p>

    </div>
  )
}