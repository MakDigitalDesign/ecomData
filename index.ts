import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.product.create({
        data: {
            name: "Cushion Moss",
            path: "/cushion-moss-for-sale/",
            price: 29.99,
            thumbnail: "https://cdn11.bigcommerce.com/s-f74ff/images/stencil/291x291/products/9104/34894/78700277-fresh-and-green-pillow-moss__51751.1632450871.jpg"
        }
    })
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })