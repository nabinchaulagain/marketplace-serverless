'use client';
import { getProducts, type ProductListResponse } from '@/api/products';
import { QueryKeys } from '@/constants/query';
import {
    useInfiniteQuery,
    type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';

export default function useProductList(
    accessToken: string,
): UseInfiniteQueryResult<{ pages: ProductListResponse[] }> {
    return useInfiniteQuery({
        queryKey: [QueryKeys.ALL_PRODUCTS],
        queryFn: async ({ pageParam: lastEvaluatedKey }) => {
            return await getProducts(accessToken, lastEvaluatedKey);
        },
        initialPageParam: null,
        getNextPageParam: (lastPage: ProductListResponse) => {
            if (isEmpty(lastPage.lastEvaluatedKey)) {
                return null;
            }
            return lastPage.lastEvaluatedKey;
        },
    });
}
