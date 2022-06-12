import {
  assert,
  assertMatch,
  assertNotStrictEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.143.0/testing/asserts.ts";
import { args, cache } from "../lib.ts";
import { download, parse } from "../providers/kufar.ts";
import { AdItem } from "../types.ts";

Deno.test("kufar", async (t) => {
  let _data: string;
  let _items: AdItem[];

  await t.step("download", async () => {
    _data = args.useCache
      ? await cache(".data/kufar.html", download)
      : await download();
    assertNotStrictEquals(_data.length, 0);
  });

  await t.step("parse", () => {
    const items = [...parse(_data)];
    assert(Array.isArray(items));
    _items = items;
  });

  await t.step("items", () => {
    const items = _items;
    assertNotStrictEquals(items.length, 0);
    const item = items[0];
    assertMatch(item.id, /^\d+$/);
    assertStrictEquals(item.provider, "kufar.by");
    assert(item.title?.length);
    assert(item.url?.length);
  });
});
