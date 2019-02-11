/**
 * @module logger
 */

const log = (...message: any[]) => {
  try {
    console.log(new Date(), ...message);
  } catch (e) {
    // swallow error
  }
};

let isEnabled = false;

export default {
  mode(enabled: boolean) {
    isEnabled = enabled;
  },
  log(...message: any[]) {
    if (isEnabled) {
      log(...message);
    }
  },
  force: log
};
