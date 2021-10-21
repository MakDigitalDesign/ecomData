export const productInfoFragment = /* GraphQL */ `
    fragment Product on Product{
        name @include(if: $name)
        path @include(if: $path)
        price @include(if: $price)
        thumbnail @include(if: $thumbnail)
        description @include(if: $description)
        sku @include(if: $sku)
        id
    }
`