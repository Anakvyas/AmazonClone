const prisma = require("../src/config/prisma")
const axios = require("axios")

async function main() {

  const response = await axios.get("https://dummyjson.com/products?limit=100")

  const products = response.data.products

  for (const p of products) {

    // find category
    let category = await prisma.category.findUnique({
      where: { name: p.category }
    })

    // create category if not exists
    if (!category) {
      category = await prisma.category.create({
        data: { name: p.category }
      })
    }

    // create product
    await prisma.product.create({
      data: {
        name: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        imageUrl: p.thumbnail,
        categoryId: category.id
      }
    })

  }

  console.log("Products inserted successfully!")

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())