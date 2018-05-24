// old ie
if (!console.log) {
  window.console.log = () => {};
}

const noLog = (...args) => {};
const doLog = console.log.bind(console, "asa.js");

let _log = noLog;

export const log = (...args) => _log(...args);
export const setDebugMode = on => {
  _log = on ? doLog : noLog;
};
export const forceLog = doLog;
