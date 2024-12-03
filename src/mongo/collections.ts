import { getDbOrThrow } from "mongo/client";
import { RequestDoc } from "types";

export const collections = {
  get requests() {
    return getDbOrThrow().collection<RequestDoc>("requests");
  },
};
