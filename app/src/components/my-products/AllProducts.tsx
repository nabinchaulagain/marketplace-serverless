'use client';
import ProductList from '@/components/product-list/ProductList';
import useAllProducts from '@/hooks/products/useAllProducts';
import { type ReactNode } from 'react';

export default function AllProducts({
    accessToken,
}: {
    accessToken: string;
}): ReactNode {
    const {
        data: pages,
        isFetching,
        hasNextPage,
        fetchNextPage,
    } = useAllProducts(accessToken);

    return (
        <ProductList
            pages={pages}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
        />
    );
}
