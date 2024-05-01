import z from 'zod';

export const addProductRequestBodySchema = z.object({
    name: z.string().min(3),
    image: z.object({
        name: z.string(),
        base64EncodedContent: z.string(),
    }),
    price: z.number().positive(),
});
