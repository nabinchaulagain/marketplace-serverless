'use client';
import { useRef, type ReactNode, useEffect } from 'react';
import { type Product, type ProductListResponse } from '@/api/products';
import { ProductCard } from '@/components/product-list/ProductCard';

interface Props {
    pages: { pages: ProductListResponse[] } | undefined;
    isFetching: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => unknown;
}

export default function ProductList({
    pages,
    isFetching,
    hasNextPage,
    fetchNextPage,
}: Props): ReactNode {
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
            {pages?.pages[0].data?.length === 0 && (
                <div className="text-center p-4 m-4 bg-gray-100 border-xlg w-1/2 mx-auto text-3xl">
                    <h1>No products found...</h1>
                </div>
            )}
            <div ref={endOfPageRef} />
        </div>
    );
}
