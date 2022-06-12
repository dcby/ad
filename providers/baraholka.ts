import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.30-alpha/deno-dom-wasm.ts";
import { AdItem } from "../types.ts";

export async function download() {
  const res = await fetch(
    "https://baraholka.onliner.by/search.php?q=marantz&f=45&topicTitle=1&cat=1&by=created",
  );
  const text = await res.text();

  return text;
}

export function* parse(html: string): Iterable<AdItem> {
  const document = new DOMParser().parseFromString(html, "text/html");

  if (document === null) {
    throw new Error("Input data is not HTML.");
  }

  const e = document.querySelector("table.ba-tbl-list__table");
  if (e === null) {
    throw new Error("Unexpected data.");
  }

  const ee = e.querySelectorAll(":scope > tbody > tr:not(.sorting__1)");
  for (const e of ee) {
    if (e instanceof Element) {
      const item = parseItem(e as Element);
      yield item;
    } else {
      throw new Error("Unexpected data.");
    }
  }
}

function parseItem(el: Element): AdItem {
  let e = el.querySelector(
    ":scope > td.frst.ph.colspan > table > tbody > tr > td.txt > div.txt-i",
  );
  if (e === null) {
    throw new Error("Unexpected data.");
  }

  e = e.querySelector(":scope > table > tbody > tr > td > h2 > a");
  if (e === null) {
    throw new Error("Unexpected data.");
  }

  const title = e.textContent;
  const url = new URL(
    e.getAttribute("href") ?? "",
    "https://baraholka.onliner.by/",
  );
  const id = url.searchParams.get("t") ?? "";

  const result = {
    id,
    provider: "baraholka.onliner.by",
    title,
    url: url.toString(),
  };

  return result;
}
