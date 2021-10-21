import { gql } from 'apollo-server'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context';
import { buildSubgraphSchema } from '@apollo/subgraph'


export const typeDefs = gql`

    type CategoryEdge {
        node: Category
    }
    type ProductEdge {
        node: Product
    }
    
    type PageInfo {
        total: Int
        totalPages: Int
    }

    type CategoriesResponse {
        edges: [CategoryEdge]
        pageInfo: PageInfo
    }

    type ProductsResponse {
        edges: [ProductEdge]
        pageInfo: PageInfo
    }

    type ProductResponse {
        node: Product
    }

    type Product {
        id: Int!
        createdAt: DateTime!
        name: String!
        path: String!
        price: Float!
        thumbnail: String
        description: String
        sku: String
        categories: [Category]
    }

    type Category {
        id: Int!
        createdAt: DateTime!
        name: String!
        path: String!
        description: String
        image: String
        products: ProductsResponse
    }

    type Query {
        allProducts(skip: Int, take: Int): ProductsResponse 
        productById(id: Int): ProductResponse
        productByPath(path: String!): Product
        allCategories(skip: Int, take: Int): CategoriesResponse
        categoryById(id: Int!): Category
        categoryByPath(path: String!): Category
    }

    scalar DateTime
`

const getAllProducts = async (context, args) => {
    const data = await context.prisma.product.findMany({
        skip: args.skip ?? 0,
        take: args.take ?? 10,
        include: {
            categories: {
                include: {
                    category: true
                }
            }
        }
    })

    const total = await context.prisma.product.count()

    
    return {
        edges: data.map(product => ({
            node: {
                ...product,
                categories: product.categories.map(({category}) => category),
            }
        })),
        pageInfo: {
            total,
            totalPages: total / (args.take ?? 10)
        }
    }
}

const getAllCategories = async (context, args) => {
    const data = await context.prisma.category.findMany({
        skip: args.skip ?? 0,
        take: args.take ?? 10,
        include: {
            products: {
                include: {
                    product: true
                }
            },
            _count: {
                select: {
                    products: true
                }
            }
        }
    });

    const total = await context.prisma.category.count()


    
    return {
        edges: data.map(category => ({
            node: {
                ...category,
                products: {
                    edges: category.products.map(({product}) => ({
                        node: {
                            ...product
                        }
                    }))
                }
            }
        })),
        pageInfo: {
            total,
            totalPages: total / (args.take ?? 10)
        }
    }
}

export const resolvers = {
    Query: {
        allProducts: (_parent, args, context: Context) => {
            return getAllProducts(context, args)
        },
        productById: (_parent, args: { id: number }, context: Context) => {
            const getProduct = async (context, args) => {
                const data = await context.prisma.product.findUnique({
                    where: { id: args.id || undefined }
                })

                return {
                    node: {
                        ...data
                    }
                }
            }

            return getProduct(context, args)
        },
        productByPath: (_parent, args: { path: string }, context: Context) => {
            return context.prisma.product.findUnique({
                where: { path: args.path || undefined }
            })
        },
        allCategories: (_parent, args, context: Context) => {
            return getAllCategories(context, args)
        },
        categoryById: (_parent, args: { id: number }, context: Context) => {
            return context.prisma.category.findUnique({
                where: { id: args.id || undefined }
            })
        },
        categoryByPath: (_parent, args: { path: string }, context: Context) => {
            return context.prisma.category.findUnique({
                where: { path: args.path || undefined }
            })
        },
    },
    DateTime: DateTimeResolver,
}