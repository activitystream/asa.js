import puppeteer from "puppeteer";

export default options => ({
  ongenerate: () => {
    const LGREEN = "\x1B[1;32m";
    const GREEN = "\x1B[0;32m";
    const RED = "\x1B[0;31m";
    const NONE = "\x1B[0m";

    puppeteer.launch().then(browser =>
      browser.newPage().then(page =>
        page
          .on("console", msg => {
            try {
              const message = JSON.parse(msg.text());
              if (message.type === "PASS") {
                console.log(LGREEN + message.text + NONE + "\n");
              } else if (message.type === "FAIL") {
                console.log(RED + message.text + NONE + "\n");
                process.exit(1);
              } else if (message.type === "END") {
                console.log(GREEN + "Test successful." + NONE + "\n");
                process.exit(0);
              }
            } catch (e) {}
          })
          .goto(options.url)
      )
    );
  }
});
