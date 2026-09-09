// @ts-expect-error Bun provides this module at test runtime
import { expect, it, mock, beforeEach } from "bun:test";
import { insertNewSubscriber } from "./queries";
import type { NewSubscription } from "./schema";
import type { D1Database } from "@cloudflare/workers-types";
import { getTestDb } from "../../../test/get-test-db";
import * as schema from "./schema";

mock.module("./db.ts", () => {
  return {
    getDb: () => getTestDb(),
  };
});

beforeEach(async () => {
  const db = getTestDb();
  // Test တစ်ခုစီမတိုင်မီ data အဟောင်းများကို ရှင်းထုတ်ခြင်း
  await db.delete(schema.subscribers);
});

it("should insert a new subscriber into the database", async () => {
  const newSubscriber: NewSubscription = {
    email: "min@gmail.com",
  };
  const subscriber = await insertNewSubscriber({} as D1Database, newSubscriber);

  expect(subscriber.email).toBe(newSubscriber.email);
});

it("should return same email duplicate email error", async () => {
  const newSubscriber: NewSubscription = {
    email: "min@gmail.com",
  };

  // ပထမအကြိမ် အောင်မြင်စွာ ထည့်သွင်းခြင်း
  await insertNewSubscriber({} as D1Database, newSubscriber);

  // ဒုတိယအကြိမ် ထပ်ထည့်သည့်အခါ error throw ဖြစ်မဖြစ် စစ်ဆေးခြင်း
  await expect(
    insertNewSubscriber({} as D1Database, newSubscriber)
  ).rejects.toThrow();
});

it("should return same email duplicate email error", async () => {
  const newSubscriber: NewSubscription = {
    email: "min@gmail",
  };

  await expect(insertNewSubscriber({} as D1Database, newSubscriber)).rejects.toThrow();

})