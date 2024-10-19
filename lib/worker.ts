/**
 * @file
 * Worker process. This spawns the inference daemons.
 */

import { Worker } from "bullmq";

const { INFERENCE_PROMPT, BSKY_USERNAME, BSKY_PASSWORD } = process.env;

if (!INFERENCE_PROMPT) {
  console.error("$INFERENCE_PROMPT not set. Exiting...");
  process.exit();
}

// if (!BSKY_USERNAME || !BSKY_PASSWORD) {
//   console.error("$BSKY_USERNAME or $BSKY_PASSWORD not set! Exiting...");
//   process.exit();
// }

export const worker = new Worker(
  "firehose",
  `${process.cwd()}/lib/inference.ts`,
  {
    connection: {
      host: "redis",
    },
  }
);
