import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { ClientError } from "./error";
import { productInfoFragment } from "./fragments/product";

interface Config {
    url: string
    headers?: AxiosRequestHeaders
}

interface ProductOptions {
    skip?: Number | String
    take?: Number | String
    fields?: Array<keyof ProductFields>
}

interface ProductByIdOperation {
    id: Number
    fields?: Array<keyof ProductFields>
}


type ProductFields = {
    name?: String
    path?: String
    price?: Number
    thumbnail?: String
    description?: String
    sku?: String
}

type Product = Required<ProductFields>

type Node = {
    node: Product 
}

interface GetProductsResponse {
    data: {
        data: {
            allProducts: {
                edges: Node[]
            }
        }
    }
}

interface GetProductByIdResponse {
    data: {
        data: {
            productById: Node
        }
    }
}

class Client {
    private config: Config;
    private instance: AxiosInstance;

    constructor(config: Config) {
        if (!config) {
            throw new Error(
                "Config is missing"
            )
        }

        this.config = config;
        this.instance = this.initialize(config)
    }

    private initialize = ({ url, headers }: Config) => {
        return axios.create({
            baseURL: url,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                ...headers
            },
            method: 'POST'
        })
    }

    private constructVariablesObject(options: ProductOptions) {
        const { 
            skip,
            take,
            fields
        } = options

        const showAllFields = !fields

        return {
            skip,
            take,
            name: (fields && fields.includes("name")) ?? showAllFields,
            path: (fields && fields.includes("path")) ?? showAllFields,
            price: (fields && fields.includes("price")) ?? showAllFields,
            thumbnail: (fields && fields.includes("thumbnail")) ?? showAllFields,
            description: (fields && fields.includes("description")) ?? showAllFields,
            sku: (fields && fields.includes("sku")) ?? showAllFields
        }
    }

    public async getProducts(options: ProductOptions) {
        const instance = this.instance;
        
        const variables = this.constructVariablesObject(options)

        const { data }: GetProductsResponse = await instance.post("", {
            query: `
            query Query(
                $skip: Int = 0, 
                $take: Int = 10, 
                $name: Boolean = true,
                $path: Boolean = true,
                $price: Boolean = true,
                $thumbnail: Boolean = true,
                $description: Boolean = true,
                $sku: Boolean = true

            ) {
                allProducts(skip: $skip, take: $take) {
                  edges {
                    node {
                        ...Product
                    }
                  }
                }
              }

              ${productInfoFragment}
              `,
              variables
        })

        return data.data;
    }

    public async getProductById(options: ProductByIdOperation) {
        const instance = this.instance;
        
        const variables = this.constructVariablesObject(options)

        const { data }: GetProductByIdResponse= await instance.post("", {
            query: `
            query Query(
                $Id: Int!,
                $name: Boolean = true,
                $path: Boolean = true,
                $price: Boolean = true,
                $thumbnail: Boolean = true,
                $description: Boolean = true,
                $sku: Boolean = true

            ) {
                productById(id: $Id) {
                    node {
                        ...Product
                    }
                }
              }

              ${productInfoFragment}
              `,
              variables: {
                  ...variables,
                  Id: options.id
              }
        })

        return data.data.productById.node;
    }
}

export default Client;