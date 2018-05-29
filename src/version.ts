import * as features from "./features";
import pkg from "../package.json";

export const version = () =>
  pkg.version +
  (features.experimentsLive() ? `-${features.experimentsLive()}` : "");
