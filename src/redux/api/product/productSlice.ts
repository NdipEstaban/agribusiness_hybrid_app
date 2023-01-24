import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const productSlice = createApi({
    reducerPath:"Product",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:7000/products"}),
    tagTypes:['Product'],
    endpoints:(builder) => ({
        searchProduct:builder.query({
            query:(product) => `search-product?search=${product}`
        }),
        getConsumerProducts:builder.query({
            query:() => 'get-consumer-products'
        }),
        getProducts:builder.query({
            query:() => 'get-products'
        }),
        createNewProduct:builder.mutation({
            query:(info) => ({
                url:"new-product",
                method:"POST",
                body:{
                    ...info
                }
            }),
        }),
        updateProduct: builder.mutation({
            query:(info) => ({
                url:"update-product",
                method:"PUT",
                body:{
                    ...info
                }
            }),
        }),
        deleteProduct:builder.mutation({
            query:(info) => ({
                url:"delete-product",
                method:"DELETE",
                body:{
                    ...info
                }
            }),
        })
    })
});


export const {
    useSearchProductQuery,
    useCreateNewProductMutation,
    useGetConsumerProductsQuery,
    useGetProductsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productSlice;

export default productSlice;