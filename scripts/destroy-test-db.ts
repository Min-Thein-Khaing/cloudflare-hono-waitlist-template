
declare const Bun: {
    file(path: string): {
        exists(): Promise<boolean>
        delete(): Promise<void>
    }
}

const destroyTestDb =async () => {
    await Bun.file('test.sqlite').delete()
    console.log("Test Database Destroyed")
}

destroyTestDb()