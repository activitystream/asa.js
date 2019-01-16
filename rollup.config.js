import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

const ENV = ["DEVELOPMENT", "PRODUCTION"].reduce(
  (acc, curr) => {
    const obj = Object.assign({}, acc);
    obj[curr] = !!process.env[curr];
    obj[process.env[curr]] = curr;
    return obj;
  },
  {
    toString() {
      return this.true;
    }
  }
);

const DEFAULT = {
  output: {
    name: "asa",
    format: "umd",
    globals: {
      "whatwg-fetch": "fetch",
      "promise-polyfill/src/polyfill": "Promise"
    }
  },
  cache: false,
  perf: true,
  external: ["whatwg-fetch", "whatwg-url", "promise-polyfill/src/polyfill"],
  plugins: [
    typescript(),
    resolve({
      browser: true
    }),
    commonjs({
      namedExports: !ENV.PRODUCTION && { chai: ["expect"] },
      include: ["node_modules/**"],
      sourceMap: false
    }),
    json()
  ]
};

const MAKE = {};

MAKE.PRODUCTION = () => [
  Object.assign({}, DEFAULT, {
    input: "src/index.ts",
    output: Object.assign({}, DEFAULT.output, {
      file: "dist/asa.min.js"
    }),
    plugins: DEFAULT.plugins.concat([
      babel({
        runtimeHelpers: true,
        sourceMap: true,
        extensions: [".ts", ".js"]
      }),
      uglify()
    ])
  }),
  Object.assign({}, DEFAULT, {
    input: "server/index.ts",
    globals: {
      "node-fetch": "fetch"
    },
    external: [
      "path",
      "fs",
      "http",
      "url",
      "crypto",
      "events",
      "net",
      "querystring",
      "buffer",
      "util",
      "zlib",
      "stream",
      "tty"
    ],
    output: Object.assign({}, DEFAULT.output, {
      format: "cjs",
      file: "dist/server.js"
    }),
    plugins: [
      typescript(),
      resolve({
        node: true
      }),
      commonjs(),
      json()
    ]
  }),
  Object.assign({}, DEFAULT, {
    input: "src/index.ts",
    output: Object.assign({}, DEFAULT.output, {
      format: "es",
      file: "dist/asa.es"
    })
  }),
  Object.assign({}, DEFAULT, {
    input: "src/index.ts",
    output: Object.assign({}, DEFAULT.output, {
      format: "cjs",
      file: "dist/asa.cjs"
    })
  })
];

export default MAKE[ENV]();
