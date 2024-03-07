import z from 'zod';

export const addProductRequestBodySchema = z.object({
    name: z.string().min(3),
    imageURL: z.string().url(),
    price: z.number().positive(),
});
