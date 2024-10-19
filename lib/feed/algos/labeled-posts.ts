import { QueryParams } from "../lexicon/types/app/bsky/feed/getFeedSkeleton";
import { LabelerServer } from "@skyware/labeler";

// max 15 chars
export const shortname = "labeled-posts";

export const handler = async (labeler: LabelerServer, params: QueryParams) => {
  // let builder = labeler.db
  //   .selectFrom("post")
  //   .selectAll()
  //   .orderBy("indexedAt", "desc")
  //   .orderBy("cid", "desc")
  //   .limit(params.limit);

  // if (params.cursor) {
  //   const timeStr = new Date(parseInt(params.cursor, 10)).toISOString();
  //   builder = builder.where("post.indexedAt", "<", timeStr);
  // }
  // const res = await builder.execute();

  const res = await labeler.db.prepare("SELECT * FROM ....").all();

  const feed = res.map((row) => ({
    post: row.uri,
  }));

  let cursor: string | undefined;
  const last = res.at(-1);
  if (last) {
    cursor = new Date(last.indexedAt).getTime().toString(10);
  }

  return {
    cursor,
    feed,
  };
};
