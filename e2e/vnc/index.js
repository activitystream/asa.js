import RFB from "@novnc/novnc/core/rfb";
import socketio from "socket.io-client";

const socket = socketio("http://localhost:8005");

const rfb = new RFB(document.body, "ws://127.0.0.1:5900");
rfb._canvas.parentElement.id = "rfb";
rfb.clipViewport = true;
rfb.viewOnly = true;

const panel = document.createElement("div");
panel.id = "panel";
rfb._canvas.parentElement.appendChild(panel);

socket.on("broadcast", data => {
  panel.innerHTML = panel.innerHTML + data;
});
