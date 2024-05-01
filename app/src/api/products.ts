import { type addProductSchema } from '@/schemas/products';
import { type z } from 'zod';

export interface ProductListResponse {
    data: Product[];
    lastEvaluatedKey: unknown;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

export interface ProductCreationRequestPayload {
    name: string;
    price: number;
    image: { base64EncodedContent: string; name: string };
}

export async function getProducts(
    accessToken: string,
    lastEvaluatedKey?: unknown,
): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', '5');
    if (lastEvaluatedKey) {
        queryParams.append(
            'lastEvaluatedKey',
            JSON.stringify(lastEvaluatedKey),
        );
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?${queryParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        },
    );
    const products = await response.json();
    return products;
}

export async function getMyProducts(
    accessToken: string,
    lastEvaluatedKey?: unknown,
): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', '5');
    if (lastEvaluatedKey) {
        queryParams.append(
            'lastEvaluatedKey',
            JSON.stringify(lastEvaluatedKey),
        );
    }
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/me?${queryParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        },
    );
    return await response.json();
}

export async function createProduct(
    accessToken: string,
    body: z.TypeOf<typeof addProductSchema>,
): Promise<void> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            method: 'POST',
        },
    );
    await response.json();
}
