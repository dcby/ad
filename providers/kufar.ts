import { cheerio as $, TagElement } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import { AdItem } from "../types.ts";

export default async function getAds(): Promise<AdItem[]> {
    const res = await fetch("https://www.kufar.by/l?ot=1&query=marantz", {
        headers: {
            "Cookie": "kuf_agr={%22advertisements%22:true%2C%22statistic%22:true%2C%22mindbox%22:true}"
        }
    });
    const text = await res.text();

    // await Deno.writeTextFile(".data/kufar.html", text);

    // const text = await Deno.readTextFile(".data/kufar.html");
    
    const $root = $.load(text);

    let $e = $root("div[data-name='listings']");
    if ($e.length !== 1) {
        return [];
    }

    $e = $("section", $e);
    if ($e.length === 0) {
        return [];
    }

    const ret: AdItem[] = [];
    $e.each((_, e) => {
        if (e.type === "tag") {
            const item = parseItem(e);
            if (item) {
                ret.push(item);
            }
        }
    });
    
    return ret;
}

function parseItem(el: TagElement): AdItem | undefined {
    let $e = $("> a", el);
    const url = new URL($e.attr("href") ?? "");

    $e = $("> div > div > div > h3", $e);
    const title = $e.text();

    return {
        id: url.pathname.split("/").at(-1) ?? "",
        provider: "kufar.by",
        title,
        url: url.toString(),
    };
}
