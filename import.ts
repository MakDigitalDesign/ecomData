import { PrismaClient } from '@prisma/client'
import bigcommerce from './src/config/bigcommerce'

const prisma = new PrismaClient()

async function importData() {

    const categoryData = await bigcommerce.get("/catalog/categories")

    const categories = categoryData.data.map(normalizeCategory)

    await prisma.category.createMany({
        data: categories
    })


    // const data = await bigcommerce.get("/catalog/products?include=variants,custom_fields,bulk_pricing_rules,options,modifiers,primary_image")

    // const product = normalizeProduct(data.data[1])

    // await prisma.product.create({
    //     data: {
    //         ...product,

    //     }
    // })

}


const normalizeCategory = ({ name, description, custom_url, image_url }) => ({
    name,
    description,
    image: image_url,
    path: custom_url.url
})

const normalizeProduct = ({ name, type, sku, description, categories, calculated_price, primary_image, custom_url, ...product }) => ({
    name,
    type,
    sku,
    description,
    price: calculated_price,
    thumbnail: primary_image.url_thumbnail,
    path: custom_url.url
})

importData()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })