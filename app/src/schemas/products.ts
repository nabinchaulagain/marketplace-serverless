import { z } from 'zod';

export const addProductSchema = z.object({
    name: z.string().min(3),
    price: z.coerce.number().positive().lt(100),
});
