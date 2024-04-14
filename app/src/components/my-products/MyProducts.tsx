'use client';
import ProductList from '@/components/product-list/ProductList';
import useMyProducts from '@/hooks/products/useMyProducts';
import { type ReactNode } from 'react';

export default function MyProducts({
    accessToken,
}: {
    accessToken: string;
}): ReactNode {
    const {
        data: pages,
        isFetching,
        hasNextPage,
        fetchNextPage,
    } = useMyProducts(accessToken);

    return (
        <ProductList
            pages={pages}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
        />
    );
}
