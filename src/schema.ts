import { gql } from 'apollo-server'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context';

export const typeDefs = gql`
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
        products: [Product]
    }

    type Query {
        allProducts: [Product!]!
        productById(id: Int): Product
        allCategories: [Category!]!
        categoryById(id: Int): Category
    }

    scalar DateTime
`

export const resolvers = {
    Query: {
        allProducts: (_parent, _args, context: Context) => {
            return context.prisma.product.findMany()
        },
        productById: (_parent, args: { id: number }, context: Context) => {
            return context.prisma.product.findUnique({
                where: { id: args.id || undefined }
            })
        },
        allCategories: (_parent, _args, context: Context) => {
            return context.prisma.category.findMany()
        },
        categoryById: (_parent, args: { id: number }, context: Context) => {
            return context.prisma.category.findUnique({
                where: { id: args.id || undefined }
            })
        }
    },
    DateTime: DateTimeResolver,
}