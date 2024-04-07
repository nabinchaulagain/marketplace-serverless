import { type ReactNode } from 'react';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import ProductList from '@/components/product-list/ProductList';
import { getAccessToken } from '@/utils/auth';
import { getProducts } from '@/api/products';
import { QueryKeys } from '@/constants/query';

export default async function Home(): Promise<ReactNode> {
    const queryClient = new QueryClient();

    const accessToken = await getAccessToken();
    await queryClient.prefetchInfiniteQuery({
        queryKey: [QueryKeys.ALL_PRODUCTS],
        queryFn: async () => {
            const res = await getProducts(accessToken);

            return res || [];
        },
        initialPageParam: null,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductList accessToken={accessToken} />
        </HydrationBoundary>
    );
}
