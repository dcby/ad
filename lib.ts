import { parse } from "https://deno.land/std@0.143.0/flags/mod.ts";
import { dirname } from "https://deno.land/std@0.143.0/path/mod.ts";

export const args = parse(Deno.args, {
  alias: { useCache: "use-cache" },
}) as unknown as {
  useCache?: boolean;
};

export async function cache(file: string, get: () => Promise<string>) {
  try {
    return await Deno.readTextFile(file);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      const text = await get();
      const path = dirname(file);
      await Deno.mkdir(path, { recursive: true });
      await Deno.writeTextFile(file, text);
      return text;
    }
    throw e;
  }
}
