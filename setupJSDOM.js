const html = require("fs").readFileSync("./build/index.html");

document.write(html);

require("./src/polyfills");
