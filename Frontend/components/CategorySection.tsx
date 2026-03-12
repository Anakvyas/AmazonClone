"use client"

import { useEffect, useState } from "react"
import { getProductsByCategory } from "@/services/api"
import CategoryCard from "./CategoryCard"

export default function CategorySection() {

  const [beauty,setBeauty] = useState([])
  const [fragrances,setFragrances] = useState([])
  const [furniture,setFurniture] = useState([])
  const [groceries,setGroceries] = useState([])


useEffect(() => {

    const fetchData = async () => {
      const beautyRes = await getProductsByCategory("beauty")
      const fragrancesRes = await getProductsByCategory("fragrances")
      const furnitureRes = await getProductsByCategory("furniture")
      const groceriesRes = await getProductsByCategory("groceries")

      setBeauty(beautyRes.data.data)
      setFragrances(fragrancesRes.data.data)
      setFurniture(furnitureRes.data.data)
      setGroceries(groceriesRes.data.data)
  }

  fetchData()

}, [])

{console.log(beauty)}

  return (

    <div className="bg-gray-200 py-6">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <CategoryCard
          title="Beauty picks"
          products={beauty}
        />

        <CategoryCard
          title="Fragrances"
          products={fragrances}
        />

        <CategoryCard
          title="Furniture deals"
          products={furniture}
        />

        <CategoryCard
          title="Groceries"
          products={groceries}
        />

      </div>

    </div>

  )
}