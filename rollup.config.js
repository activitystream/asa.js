import resolve from "rollup-plugin-node-resolve";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import commonjs from "rollup-plugin-commonjs";
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import uglify from "rollup-plugin-uglify";
import livereload from "rollup-plugin-livereload";

class Monum {
  constructor(map) {
    Object.entries(map).forEach(([key, value]) =>
      Object.assign(this, { [key]: !!value, [!!value]: key })
    );
  }

  [Symbol.toPrimitive]() {
    return this.true;
  }
}

const ENV = new Monum({
  DEVELOPMENT: process.env.DEVELOPMENT,
  PRODUCTION: process.env.PRODUCTION
});

const DEFAULT = {
  output: {
    name: "asa",
    format: "umd",
    globals: {
      "whatwg-fetch": "fetch"
    }
  },
  cache: false,
  perf: true,
  external: ["whatwg-fetch"],
  plugins: [
    typescript(),
    resolve({
      browser: true
    }),
    commonjs({
      namedExports: ENV.DEVELOPMENT ? { chai: ["expect"] } : {},
      include: ["node_modules/**"],
      sourceMap: false
    }),
    globals(),
    builtins(),
    json()
  ]
};

const MAKE = {};

MAKE.DEVELOPMENT = () => ({
  ...DEFAULT,
  input: "src/index.spec.ts",
  output: {
    ...DEFAULT.output,
    file: "build/asa.js",
    sourcemap: true
  },
  external: ["mocha", "it", "describe"],
  watch: {
    chokidar: false,
    include: "src/**",
    exclude: "node_modules/**"
  },
  plugins: [
    ...DEFAULT.plugins,
    serve({
      open: true,
      contentBase: ["build"]
    }),
    livereload({
      watch: "build"
    })
  ]
});

MAKE.PRODUCTION = () => [
  {
    ...DEFAULT,
    input: "src/index.ts",
    output: {
      ...DEFAULT.output,
      file: "dist/asa.min.js"
    },
    plugins: [...DEFAULT.plugins, uglify()]
  },
  {
    ...DEFAULT,
    input: "src/index.ts",
    output: {
      ...DEFAULT.output,
      format: "es",
      file: "dist/asa.es"
    }
  },
  {
    ...DEFAULT,
    input: "src/index.ts",
    output: {
      ...DEFAULT.output,
      format: "cjs",
      file: "dist/asa.cjs"
    }
  }
];

export default MAKE[ENV]();
