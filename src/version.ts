import * as features from "./features";

export const major = 1;
export const minor = 1;
export const build = 77;
export const version = () =>
  [major, minor, build].join(".") +
  (features.experimentsLive() ? `-${features.experimentsLive()}` : "");
