import io from "socket.io-client";
import * as rfb2 from "rfb2";
const { createConnection, encodings, RfbClient } = rfb2;

const stream = io("http://127.0.0.1:5900");
console.log(stream);
const rfb = createConnection({
  host: "127.0.0.1",
  port: 5900,
  stream: stream
});

rfb.on("connect", (...args) => {
  console.log("successfully connected and authorised", rfb, args);
  console.log(
    `remote screen name: ${rfb.title} width:${rfb.width} height: ${rfb.height}`
  );
});

rfb.on("error", error => {
  throw new Error(error);
});

rfb.pointerEvent(100, 100, 0); // x, y, button state (bit mask for each mouse button)
rfb.keyEvent(40, 0); // keycode, is down?
rfb.updateClipboard("send text to remote clipboard");

// screen updates
rfb.on("rect", rect => {
  switch (rect.encoding) {
    case encodings.raw:
    // rect.x, rect.y, rect.width, rect.height, rect.data
    // pixmap format is in rfb.bpp, rfb.depth, rfb.redMask, greenMask, blueMask, redShift, greenShift, blueShift
    case encodings.copyRect:
    // pseudo-rectangle
    // copy rectangle from rect.src.x, rect.src.y, rect.width, rect.height, to rect.x, rect.y
    // case encodings.hextile:
    //   // not fully implemented
    //   rect.on("tile", handleHextileTile); // emitted for each subtile
  }
});

rfb.on("resize", ({ width, height }) => {
  console.log(
    "window size has been resized! Width: %s, Height: %s",
    width,
    height
  );
});

rfb.on("clipboard", newPasteBufData => {
  console.log("remote clipboard updated!", newPasteBufData);
});

rfb.on("bell", console.log.bind(null, "Bell!!"));

// force update
// updates are requested automatically after each new received update
// you may want to have more frequent updates for high latency / high bandwith connection
rfb.requestUpdate(false, 0, 0, rfb.width, rfb.height); // incremental?, x, y, w, h

rfb.end(); // close connection
