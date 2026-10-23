import path from "node:path";
import { env, pipeline } from "@huggingface/transformers";

const modelId = "Xenova/bge-m3";
env.cacheDir = path.resolve("models");

console.log(`Pobieram ${modelId} do ${env.cacheDir} (ok. 560 MB, tylko za pierwszym razem)...`);
const embed = await pipeline("feature-extraction", modelId, { dtype: "q8" });
const [vector] = (await embed(["Czy potrzebuję patentu żeglarskiego?"], { pooling: "cls", normalize: true })).tolist();
console.log(`Model gotowy, wektor ma ${vector.length} wymiarów.`);
