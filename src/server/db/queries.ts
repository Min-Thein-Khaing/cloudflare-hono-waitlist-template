import type { D1Database } from "@cloudflare/workers-types";
import { getDb } from "./db";
import type { NewSubscription } from "./schema";
import * as schema from "./schema";

export const insertNewSubscriber = async (d1Database:D1Database,newSubscriber: NewSubscription) => {
    const db = getDb(d1Database);
   const [result] =  await db.insert(schema.subscribers).values(newSubscriber).returning();
   return result;
}