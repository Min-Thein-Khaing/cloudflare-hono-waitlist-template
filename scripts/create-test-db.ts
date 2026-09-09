// @ts-expect-error Bun provides this module at runtime when the script is run with Bun.
import {Database} from 'bun:sqlite'
import {drizzle} from 'drizzle-orm/bun-sqlite'
import {migrate} from 'drizzle-orm/bun-sqlite/migrator'

declare const Bun: {
    file(path: string): {
        exists(): Promise<boolean>
        delete(): Promise<void>
    }
}

export const createTestDb = async()=>{
    const testDb = Bun.file('test.sqlite')
    if(await testDb.exists()){
        await Bun.file('test.sqlite').delete()
    }
    const sqlite = new Database('test.sqlite');
    const db = drizzle(sqlite)
    migrate(db,{migrationsFolder:'./src/server/db/migrations'})
    console.log("Test Database Created And Migrated")
}

createTestDb()