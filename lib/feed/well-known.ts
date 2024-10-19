import express from "express";
import { AppContext } from "./config";

const makeRouter = (ctx: { hostname: string; serviceDid: string }) => {
  const router = express.Router();

  router.get("/.well-known/did.json", (_req, res) => {
    if (!ctx.serviceDid.endsWith(ctx.hostname)) {
      return res.sendStatus(404);
    }
    res.json({
      "@context": ["https://www.w3.org/ns/did/v1"],
      id: ctx.serviceDid,
      service: [
        {
          id: "#bsky_fg",
          type: "BskyFeedGenerator",
          serviceEndpoint: `https://${ctx.hostname}`,
        },
      ],
    });
  });

  return router;
};
export default makeRouter;
