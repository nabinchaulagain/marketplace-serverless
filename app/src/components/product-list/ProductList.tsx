'use client';
import { useRef, type ReactNode, useEffect } from 'react';
import useProductList from '@/hooks/products/useProductList';
import { type Product, type ProductListResponse } from '@/api/products';
import { ProductCard } from '@/components/product-list/ProductCard';

export default function ProductList({
    accessToken,
}: {
    accessToken: string;
}): ReactNode {
    const {
        data: pages,
        isFetching,
        hasNextPage,
        fetchNextPage,
    } = useProductList(accessToken);
    const endOfPageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const endOfPage = endOfPageRef.current;
        if (!endOfPage) {
            return;
        }

        const intersectionObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                if (entries[0].isIntersecting && !isFetching && hasNextPage) {
                    fetchNextPage();
                }
            },
        );

        intersectionObserver.observe(endOfPage);

        return () => {
            intersectionObserver.unobserve(endOfPage);
        };
    }, [hasNextPage, isFetching, fetchNextPage]);
    return (
        <div>
            {pages?.pages.map((page: ProductListResponse): ReactNode[] =>
                page.data?.map((product: Product) => (
                    <ProductCard product={product} key={product.id} />
                )),
            )}
            <div ref={endOfPageRef} />
        </div>
    );
}
