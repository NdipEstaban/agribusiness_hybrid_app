import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { encryptResponse } from '../../../utils/crypto_utility';
import { hostAddress } from '../../../assets/constants/backend';

const productSlice = createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:`${hostAddress}/products`}),
    tagTypes:['Product', 'MerchantProducts'],
    endpoints:(builder) => ({
        searchProduct:builder.query({
            query:(product) => `search-product?search=${product}`
        }),
        getProductsInteractedWith:builder.query({
            query:(user:{userId:string,role:string}) => `get-products?user=${user}`
        }),
        getConsumerProducts:builder.mutation({
            query:(page) => ({
                url:`get-consumer-products?page=${page}`,
                method:"GET"
            }),
            invalidatesTags:['Product']
        }),
        getProducts:builder.mutation({
            query:(page) => ({
                url:`get-products?page=${page}`,
                method:"GET"
            }),
            invalidatesTags:['Product']
        }),
        getMerchantProducts:builder.query({
            query:(merchantId) => `get-merchant-products?merchantId=${merchantId}`,
            providesTags:['MerchantProducts', 'Product']
        }),
        createNewProduct:builder.mutation({
            query:(prod) => ({
                url:"new-product",
                method:"POST",
                body:{
                    product:encryptResponse(prod)
                }
            }),
            invalidatesTags:['MerchantProducts']
        }),
        updateProduct: builder.mutation({
            query:(info) => ({
                url:"update-product",
                method:"PUT",
                body:{
                    info
                }
            }),
        }),
        deleteProduct:builder.mutation({
            query:(info) => ({
                url:"delete-product",
                method:"DELETE",
                body:{
                    id:encryptResponse(info)
                }
            }),
            invalidatesTags:['MerchantProducts']
        })
    })
});


export const {
    useSearchProductQuery,
    useLazySearchProductQuery,
    useCreateNewProductMutation,
    useGetProductsMutation,
    useGetConsumerProductsMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetMerchantProductsQuery,

} = productSlice;

export default productSlice;