import { z } from 'zod';

const envSchema = z.object({
    AUTH0_CLIENT_ID: z.string(),
    AUTH0_DOMAIN: z.string(),
    AUTH0_CLIENT_SECRET: z.string(),
});

export default envSchema;
