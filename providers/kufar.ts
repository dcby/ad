import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.30-alpha/deno-dom-wasm.ts";
import { AdItem } from "../types.ts";

export async function download() {
  const res = await fetch("https://www.kufar.by/l?ot=1&query=marantz", {
    headers: {
      "Cookie":
        "kuf_agr={%22advertisements%22:true%2C%22statistic%22:true%2C%22mindbox%22:true}",
    },
  });
  const text = await res.text();

  return text;
}

export function* parse(html: string): Iterable<AdItem> {
  const document = new DOMParser().parseFromString(html, "text/html");
  if (document === null) {
    throw new Error("Input data is not HTML.");
  }

  const e = document.querySelector("div[data-name='listings']");
  if (e === null) {
    throw new Error("Input data is not HTML.");
  }

  const ee = e.querySelectorAll("section");
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
  let e = el.querySelector(":scope > a");
  if (e === null) {
    throw new Error("Unexpected data.");
  }
  const url = new URL(e.getAttribute("href") ?? "");

  e = e.querySelector(":scope > div > div > div > h3");
  if (e === null) {
    throw new Error("Unexpected data.");
  }
  const title = e.textContent;

  return {
    id: url.pathname.split("/").at(-1) ?? "",
    provider: "kufar.by",
    title,
    url: url.toString(),
  };
}
