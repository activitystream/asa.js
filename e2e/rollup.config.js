import fs from "fs";
import socketio from "socket.io";
import resolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import commonjs from "rollup-plugin-commonjs";
import { runner } from "nightwatch";
import Convert from "ansi-to-html";
const convert = new Convert();

const CONFIG = process.env.CONFIG;

const io = socketio(8005);

process.stdout.write = data => {
  io.emit("broadcast", convert.toHtml(data));
};

const nightwatch = () => ({
  ongenerate: () => {
    runner({
      config: "nightwatch.json"
    });
  }
});

const MAKE = {};
MAKE.VNC = () => ({
  input: "vnc/index.js",
  output: {
    name: "vnc",
    format: "umd",
    sourceMap: false,
    file: "vnc/vnc.min.js"
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    serve({
      contentBase: "vnc",
      open: true,
      port: 8009
    }),
    nightwatch()
  ]
});

MAKE.TEST = () => ({
  input: fs.readdirSync("src/").map(file => `src/${file}`),
  experimentalPreserveModules: true,
  output: {
    dir: "build",
    format: "cjs",
    sourceMap: true
  },
  perf: true,
  plugins: [resolve()]
});

export default (CONFIG ? MAKE[CONFIG]() : [MAKE.VNC(), MAKE.TEST()]);
