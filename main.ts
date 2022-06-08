import { getAds } from "./providers/baraholka.ts";

const items = await getAds();

console.log(items);
