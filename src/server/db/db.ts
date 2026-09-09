import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'
import type { D1Database } from "@cloudflare/workers-types";


// export type Bindings = {
//     DB: D1Database;
// };

export const getDb = (d1: D1Database) => {
    return drizzle(d1, { schema });
};
export type DrizzleDB = ReturnType<typeof getDb>;