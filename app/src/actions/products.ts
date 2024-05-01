'use server';
import { createProduct } from '@/api/products';
import { getAccessToken } from '@/utils/auth';

import { redirect } from 'next/navigation';

export async function addProduct(body: {
    name: string;
    price: number;
    image: { base64EncodedContent: string; name: string };
}): Promise<void> {
    const accessToken = await getAccessToken();

    await createProduct(accessToken, body);

    redirect('/my-products');
}
