'use client';
import ProductList from '@/components/product-list/ProductList';
import { Button } from '@/components/ui/button';
import useMyProducts from '@/hooks/products/useMyProducts';
import Link from 'next/link';
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
        <>
            <div className="mt-2 w-1/2 mx-auto">
                <Link href="/products/add">
                    <Button>Create product</Button>
                </Link>
            </div>
            <ProductList
                pages={pages}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
            />
        </>
    );
}
