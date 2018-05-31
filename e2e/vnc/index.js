import RFB from "@novnc/novnc/core/rfb";
import socketio from "socket.io-client";
import COMMAND from "./command";

const CONTROLS = false;

const socket = socketio("http://localhost:8005");

const rfb = new RFB(document.body, "ws://127.0.0.1:5900");
rfb._canvas.parentElement.id = "rfb";
rfb.clipViewport = true;
rfb.viewOnly = true;

const panel = document.createElement("div");
panel.id = "panel";
const output = document.createElement("div");
output.id = "output";
rfb._canvas.parentElement.appendChild(panel);
if (CONTROLS) {
  const controls = document.createElement("div");
  controls.id = "controls";
  const buttons = [
    document.createElement("button"),
    document.createElement("button")
  ];
  buttons[0].innerHTML = "<span>Run</span>";
  buttons[1].innerHTML = "<span>Exit</span>";
  buttons[0].className = "btn";
  buttons[0].type = "button";
  buttons[1].className = "btn red";
  buttons[1].type = "button";

  controls.appendChild(buttons[0]);
  controls.appendChild(buttons[1]);

  buttons[0].addEventListener("click", event => {
    socket.emit("command", COMMAND.RUN);
  });
  buttons[1].addEventListener("click", event => {
    socket.emit("command", COMMAND.EXIT);
  });
  panel.appendChild(controls);
} else {
  socket.emit("command", COMMAND.RUN);
}
panel.appendChild(output);

socket.on("broadcast", data => {
  const item = document.createElement("div");
  item.innerHTML = data;
  output.appendChild(item);
});

socket.on("command", command => {
  if (command === COMMAND.CLOSE) {
    window.close();
  }
});
