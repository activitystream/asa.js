import * as user from "./user";
let experiments = {};

export const defineExperiment = (name, percentage) => {
  if (typeof percentage === "boolean") {
    if (percentage) experiments[name] = percentage;
  } else experiments[name] = user.getHash() % 100 <= percentage;
};
export const isExperiment = name => {
  const exp = experiments[name];
  return !!exp;
};
export const clearExperiments = () => {
  experiments = {};
};
export const experimentsLive = () => {
  const result = [];
  for (const exp in experiments) {
    if (experiments.hasOwnProperty(exp)) {
      if (experiments[exp]) result.push(exp);
    }
  }
  return result.join(".");
};
export const MINI_AJAX = "miniAjax";
