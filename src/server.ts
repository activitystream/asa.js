import * as debug from "./debug";
import * as features from "./features";
import * as formatting from "./formatting";
import * as info from "./version";

const POST = (url, data) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "text/plain; charset=UTF-8"
    }
  });

export const EVENT = data => POST("//inbox.activitystream.com/asa", data);
export const ERROR = data => POST("//inbox.activitystream.com/asa/error", data);

const submitEvent = ev =>
  EVENT({
    ev,
    t: formatting.formatDateTime(new Date())
  });

const submitError = (err, context?) =>
  (err && (err.code === 22 || err.code === 18)) ||
  ERROR({ err, context, v: info.version() });

class Server {
  private _dispatchEvent = submitEvent;
  private _dispatchError = submitError;
  private pendingSubmission = [];
  private batchIntervalHandler;
  private done = true;

  public batchEvent(e) {
    this.pendingSubmission.push(e);
  }

  public get submitEvent() {
    return this._dispatchEvent;
  }

  public get submitError() {
    return this._dispatchError;
  }

  public batchOn() {
    this.batchIntervalHandler = setInterval(() => {
      try {
        if (this.pendingSubmission.length > 0 && this.done) {
          const batchSize = Math.min(this.pendingSubmission.length, 10);
          const event = this.pendingSubmission.slice(0, batchSize);
          this.done = false;
          submitEvent(event)
            .then(() => this.pendingSubmission.splice(0, event.length))
            .catch(debug.log);
        }
      } catch (e) {
        debug.log("exception submitting", e);
      }
    }, 400);
  }

  public batchOff() {
    if (!this.batchIntervalHandler) {
      debug.log("cannot batch off, it is not on");
    } else {
      clearInterval(this.batchIntervalHandler);
    }
  }

  public override(
    eventDispatcher = this._dispatchEvent,
    errorDispatcher = this._dispatchError
  ) {
    this._dispatchError = errorDispatcher;
    this._dispatchEvent = eventDispatcher;
  }

  public reset() {
    this._dispatchError = submitError;
    this._dispatchEvent = submitEvent;
  }
}

export default new Server();
