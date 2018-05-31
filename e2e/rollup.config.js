import fs from "fs";
import path from "path";
import socketio from "socket.io";
import resolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import commonjs from "rollup-plugin-commonjs";
import { runner } from "nightwatch";
import nightwatch from "./package.json";
import COMMAND from "./vnc/command";
import Convert from "ansi-to-html";
const convert = new Convert();

const CONFIG = process.env.CONFIG;

const io = socketio(8005);

const _write = process.stdout.write.bind(process.stdout);

io.on("connection", socket => {
  socket.on("command", command => {
    if (command === COMMAND.RUN) {
      runner(
        {
          config: "./nightwatch.json"
        },
        success => {
          socket.emit("command", COMMAND.CLOSE);
          process.exit(Number(!success));
        }
      );
    } else if (command === COMMAND.EXIT) {
      console.log("Exit.");
      process.exit();
    }
  });
});

process.stdout.write = data => {
  _write(data);
  io.emit("broadcast", convert.toHtml(data));
};

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
    })
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

export default (CONFIG ? MAKE[CONFIG]() : [MAKE.TEST(), MAKE.VNC()]);
