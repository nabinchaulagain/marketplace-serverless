import { getMyProducts } from '@/api/products';
import MyProducts from '@/components/my-products/MyProducts';
import { QueryKeys } from '@/constants/query';
import { getAccessToken } from '@/utils/auth';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import { type ReactNode } from 'react';

export default async function MyProductsPage(): Promise<ReactNode> {
    const queryClient = new QueryClient();

    const accessToken = await getAccessToken();
    await queryClient.prefetchInfiniteQuery({
        queryKey: [QueryKeys.MY_PRODUCTS],
        queryFn: async () => {
            const res = await getMyProducts(accessToken);

            return res || [];
        },
        initialPageParam: null,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MyProducts accessToken={accessToken} />
        </HydrationBoundary>
    );
}
