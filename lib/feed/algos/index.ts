import { AppContext } from "../config";
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from "../lexicon/types/app/bsky/feed/getFeedSkeleton";
import * as labelFeed from "./labeled-posts";

type AlgoHandler = (
  ctx: AppContext,
  params: QueryParams
) => Promise<AlgoOutput>;

const algos: Record<string, AlgoHandler> = {
  [labelFeed.shortname]: labelFeed.handler,
};

export default algos;
