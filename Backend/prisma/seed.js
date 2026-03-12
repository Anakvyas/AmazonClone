const prisma = require("../src/config/prisma")
const axios = require("axios")

async function main() {

  const response = await axios.get("https://dummyjson.com/products")

  const products = response.data.products

  for (const p of products) {

    let category = await prisma.category.findUnique({
      where: { name: p.category }
    })

    if (!category) {
      category = await prisma.category.create({
        data: { name: p.category }
      })
    }

    await prisma.product.create({
      data: {
        name: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: category.id,

        images: {
          create: p.images.map((img) => ({
            url: img
          }))
        }

      }
    })

  }

  console.log("Products inserted successfully!")

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())