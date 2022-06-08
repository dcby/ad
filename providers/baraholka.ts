import { cheerio as $, TagElement, TextElement } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import { AdItem } from "../types.ts";

export async function getAds(): Promise<AdItem[]> {
    // const res = await fetch("https://baraholka.onliner.by/search.php?q=marantz&f=45&topicTitle=1&cat=1");
    // const text = await res.text();

    // await Deno.writeTextFile(".data/baraholka.html", text);

    const text = await Deno.readTextFile(".data/baraholka.html");
    
    const $root = $.load(text);

    let $e = $root("table.ba-tbl-list__table");
    $e = $("> tbody > tr:not(.sorting__1)", $e);

    const items = $e
        .map((_, e) => parseItem(e))
        .get<AdItem | undefined>()
        .filter(e => e !== undefined) as AdItem[];
    
    return items;
}

function parseItem(el: TagElement | TextElement): AdItem | undefined {
    if (!isTag(el)) {
        return;
    }
    
    const $div = $("> td.frst.ph.colspan > table > tbody > tr > td.txt > div.txt-i", el);
    let $e = $("> table > tbody > tr > td > h2 > a", $div);

    const title = $e.text();
    const url = new URL($e.attr("href") ?? "", "https://baraholka.onliner.by/");
    const id = url.searchParams.get("t") ?? "";

    return {
        id,
        provider: "baraholka.onliner.by",
        title,
        url: url.toString(),
    };
}

function isTag(value: TagElement | TextElement): value is TagElement {
    return value.type === "tag";
}
