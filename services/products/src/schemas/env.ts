import { z } from 'zod';

const envSchema = z.object({
    PRODUCTS_TABLE_NAME: z.string(),
});

export default envSchema;
