// Bun provides this module at runtime, but it may not be included in the
// TypeScript project's configured type libraries.
// @ts-ignore
import { Database } from "bun:sqlite";
import {drizzle} from "drizzle-orm/bun-sqlite";


export const getTestDb = ()=>{
    const sqlite = new Database('test.sqlite');
    return drizzle(sqlite)
     
}