import { type Product } from '@/api/products';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { type ReactNode } from 'react';

interface Props {
    product: Product;
}

export function ProductCard({ product }: Props): ReactNode {
    return (
        <Card className="my-2 w-1/2 mx-auto">
            <CardHeader className="text-center">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price}</CardDescription>
            </CardHeader>
            <CardContent>
                <Image
                    className="h-[300px] mx-auto"
                    width={300}
                    height={300}
                    src={product.imageUrl}
                    alt={product.name}
                />
            </CardContent>
        </Card>
    );
}
