/**
 * @file
 * Bare-bones labeller service
 */

import { LabelerServer } from "@skyware/labeler";
import fastifyExpress from "@fastify/express";
import { createServer } from "./feed/lexicon";
import feedGeneration from "./feed/methods/feed-generation";
import describeGenerator from "./feed/methods/describe-generator";
import wellKnown from "./feed/well-known";
import { hostname } from "os";

const { LABELER_DID, SIGNING_KEY, HOSTNAME } = process.env;
const PORT = Number(process.env.PORT) ?? 14831;

if (!LABELER_DID || !SIGNING_KEY) {
  console.error("Please set $LABELER_DID and $SIGNING_KEY. Exiting...");
  process.exit();
}

const ctx = { publisherDid: "", serviceDid: "" };

const labeler = new LabelerServer({
  did: LABELER_DID,
  signingKey: SIGNING_KEY,
});

const server = createServer({
  validateResponse: true,
  payload: {
    jsonLimit: 100 * 1024, // 100kb
    textLimit: 100 * 1024, // 100kb
    blobLimit: 5 * 1024 * 1024, // 5mb
  },
});

feedGeneration(server, labeler, ctx);
describeGenerator(server, ctx);

labeler.app.register(fastifyExpress).then(() => {
  labeler.app.use(server.xrpc.router);
  labeler.app.use(
    wellKnown({ hostname: process.env.HOSTNAME!, serviceDid: labeler.did })
  );

  labeler.start(PORT, async (error) => {
    if (error) {
      console.error("Failed to start: ", error);
    } else {
      console.log("Listening on port 14831");
    }
  });
});
