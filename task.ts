import baraholka from "./providers/baraholka.ts";
import kufar from "./providers/kufar.ts";
import { AdItem, AdItemBase } from "./types.ts";

export default async function task() {
    let items = await baraholka();
    const itemMap = new Map(items.map(e => [key(e), e]));

    items = await kufar();
    for (const item of items) {
        itemMap.set(key(item), item);
    }

    const storedKeySet = new Set(await load());
    const keySet = new Set<string>();
    
    for (const [k, e] of itemMap) {
        if (!storedKeySet.has(k)) {
            if (await notify(e)) {
                keySet.add(k);
            }
            else {
                console.log("Error notifying.");
            }
        }
        else {
            keySet.add(k);
        }
    }

    await Deno.writeTextFile("ad.json", JSON.stringify(Array.from(keySet)));
}

async function load(): Promise<string[] | undefined> {
    try {
        const text = await Deno.readTextFile("ad.json");
        return JSON.parse(text) as string[];
    }
    catch (_: unknown) {
        return;
    }
}

async function notify(item: AdItem): Promise<boolean> {
    const body = {
        chat_id: -1001468140664,
        text: item.url,
    };
    const token = Deno.env.get("BOT_TOKEN");
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await wait(300);

    const res = await fetch(url, {
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });

    return res.ok;
}

function key(item: AdItemBase) {
    return `${item.provider}:${item.id}`;
}

function sleep(value: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, value));
}

let timeMark = 0;

async function wait(value: number) {
    const lapse = Date.now() - timeMark;
    if (lapse < value) {
        console.log("wait for %i", value - lapse);
        await sleep(value - lapse);
    }
    timeMark = Date.now();
}
