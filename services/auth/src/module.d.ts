import type envSchema from '@/schemas/env';
import { type TypeOf } from 'zod';

declare global {
    namespace NodeJS {
        interface ProcessEnv extends TypeOf<typeof envSchema> {}
    }
}
