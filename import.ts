import { PrismaClient } from '@prisma/client'
import Client from './client';
import bigcommerce from './src/config/bigcommerce'

const prisma = new PrismaClient()



async function importData() {

    // const categoryData = await bigcommerce.get("/catalog/categories?limit=250")

    // const categories = categoryData.data.map(normalizeCategory)

    // await prisma.category.createMany({
    //     data: categories
    // })


    const data = await getAllProducts();

    const products = data.map(normalizeProduct)

    for (const product of products){
        await prisma.product.create({
            data: product
        })
    }

    // const client = new Client({
    //     url: "http://localhost:4000/graphql"
    // })

    // const test1 = await client.getProductById({
    //     id: 6220
    // })

    // console.log(test1)

}


const normalizeCategory = ({ name, description, custom_url, image_url, id }) => ({
    name,
    description,
    image: image_url,
    path: custom_url.url,
    id
})




const getAllProducts = async (page = 1) => {

    const { data } = await bigcommerce.get(`/catalog/products?include=variants,custom_fields,bulk_pricing_rules,options,modifiers,primary_image&page=${page}`)

    if (data.length > 0){
        return data.concat(await getAllProducts(page + 1))
    } else {
        return data
    }

}

importData()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })