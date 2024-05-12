import { z } from 'zod';

const envSchema = z.object({
    PRODUCTS_TABLE_NAME: z.string(),
    ORDERS_EVENT_BUS_ARN: z.string(),
});

export default envSchema;
