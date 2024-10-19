import { Server } from "../lexicon";
import { AppContext } from "../config";
import algos from "../algos";
import { AtUri } from "@atproto/syntax";

export default function (
  server: Server,
  ctx: { publisherDid: string; serviceDid: string }
) {
  server.app.bsky.feed.describeFeedGenerator(async () => {
    const feeds = Object.keys(algos).map((shortname) => ({
      uri: AtUri.make(
        ctx.publisherDid,
        "app.bsky.feed.generator",
        shortname
      ).toString(),
    }));
    return {
      encoding: "application/json",
      body: {
        did: ctx.serviceDid,
        feeds,
      },
    };
  });
}
