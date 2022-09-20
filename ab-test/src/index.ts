/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { findActiveExperiment } from "./experiments";
import { getWeightedRandomIndex } from "./getWeightedRandomIndex";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const WORKER_NAME = "nellie.ab-test";
const VARIANT_DIGITS = 3;

// req.url includes query params
// https://com.staging.hurtigruten.com/en-au/expeditions/cruises/the-norwegian-coast-and-svalbard-autumn-cruise/booking/cabin/0/?voyageId=e0534804-5647-4956-bf65-12fd9f56c05e&quoteId=8fa202d6-ee5a-4a4a-8ff2-33e7b78d62b1
// then we can append variant as a query param

const getVariantFromCookie = (
  cookie: string | null,
  pathname: string,
  experimentIndex: number
) => {
  const start =
    experimentIndex +
    WORKER_NAME.length +
    pathname.length +
    "::variant=".length;
  const end = start + VARIANT_DIGITS;

  return cookie?.slice(start, end);
};

async function abTestingWithPassthrough(req: Request) {
  const cookie = req.headers.get("cookie");
  const url = new URL(req.url);

  const experiment = findActiveExperiment(url.pathname);

  if (!experiment) {
    return fetch(req);
  }

  const cookieExperimentIndex =
    cookie?.indexOf(`${WORKER_NAME}:${experiment.name}:variant=`) ?? -1;

  const urlVariant = url.searchParams.get("variant");
  const cookieVariant =
    cookieExperimentIndex !== -1
      ? getVariantFromCookie(cookie, url.pathname, cookieExperimentIndex)
      : null;
  const generatedVariant = getWeightedRandomIndex(
    experiment.probabilities
  ).toString();

  const variant = cookieVariant || urlVariant || generatedVariant;

  const mappedUrl = experiment.urlMapper(req.url, variant);
  const newRequest = new Request(mappedUrl, req);

  if (cookieExperimentIndex !== -1) {
    console.log("Returning request from cookie", newRequest.url);
    return fetch(newRequest);
  } else {
    try {
      let res = await fetch(newRequest);
      res = new Response(res.body, res);
      res.headers.append(
        "Set-Cookie",
        `${WORKER_NAME}:${experiment.name}:variant=${variant.padStart(
          VARIANT_DIGITS,
          "0"
        )}; path=/`
      );
      console.log("Created new variant", newRequest.url);
      return res;
    } catch (e) {
      console.log(`Cloudflare worker [${WORKER_NAME}] failed.`);
      console.log(e);
    }
  }

  return fetch(req);
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return abTestingWithPassthrough(request);
  },
};
