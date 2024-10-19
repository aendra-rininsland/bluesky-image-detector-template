/**
 * @file
 * This is where all the inference work happens.
 *
 * IF YOU'RE BUILDING YOUR OWN THING, THIS IS A GOOD PLACE TO START
 */

import { CommitCreateEvent } from "@skyware/jetstream";
import { Job } from "bullmq";
import { pipeline } from "@xenova/transformers";
import { zip } from "./util";
import { createLabel } from "./moderate";

const THRESHOLD = Number(process.env.INFERENCE_THRESHOLD) ?? 0.5;
const { INFERENCE_PROMPT } = process.env;

// Allocate a pipeline
const model = pipeline(
  "zero-shot-image-classification",
  "Xenova/clip-vit-base-patch16"
);

export default async function (
  job: Job<CommitCreateEvent<"app.bsky.feed.post">>
) {
  try {
    await job.log("Start processing job");
    const pipeline = await model;

    if (job.data.commit.record.embed?.$type === "app.bsky.embed.images") {
      const urls = job.data.commit.record.embed.images.map(
        (d) =>
          `https://cdn.bsky.app/img/feed_fullsize/plain/${job.data.did}/${d.image.ref.$link}@jpeg`
      );

      const results = await pipeline(urls, [
        INFERENCE_PROMPT!,
        `not ${INFERENCE_PROMPT}`,
      ]);

      const items = zip(urls, results).filter(
        ([_, results]) =>
          Math.max(
            ...results
              .filter((d) => d.label === INFERENCE_PROMPT)
              .map((d) => d.score)
          ) > THRESHOLD
      );

      await createLabel(job.data, items);
    }
  } catch (e) {
    console.error(e);
  }
}
