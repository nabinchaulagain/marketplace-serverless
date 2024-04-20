'use server';
import { createProduct } from '@/api/products';
import { getAccessToken } from '@/utils/auth';
import { type addProductSchema } from '@/schemas/products';
import { type z } from 'zod';

import { redirect } from 'next/navigation';

export async function addProduct(
    body: z.TypeOf<typeof addProductSchema>,
): Promise<void> {
    const accessToken = await getAccessToken();

    await createProduct(accessToken, body);

    redirect('/my-products');
}
