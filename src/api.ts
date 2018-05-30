/**
 * @module api
 */

import logger from "./logger";
import { version } from "../package.json";
import { Event } from "./event";

const toDigits = (d: number, n: number): string =>
  ("0" + Math.abs(n)).slice(-d);

export class DateTime extends Date {
  toJSON(): string {
    const offset: number = -this.getTimezoneOffset();
    const local: DateTime = new DateTime(this);
    local.setMinutes(this.getMinutes() + offset);

    return (
      local.toISOString().slice(0, -1) +
      (~Math.sign(offset) ? "+" : "-") +
      toDigits(2, offset / 60) +
      ":" +
      toDigits(2, offset % 60)
    );
  }
}

const POST = (url: string, data: { [key: string]: any }): Promise<Response> =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "text/plain; charset=UTF-8"
    }
  });

export type AsaError = { code: number };

export type EventRequest = { ev: { [key: string]: any }; t: DateTime };
export type ErrorRequest = {
  err: AsaError;
  v: string;
  context?: { [key: string]: any };
};

export const EVENT = (data: EventRequest): Promise<Response> =>
  POST("//inbox.activitystream.com/asa", data);
export const ERROR = (data: { [key: string]: any }): Promise<Response> =>
  POST("//inbox.activitystream.com/asa/error", data);

export type EventDispatcher = (event: Event) => Promise<Response>;
export type ErrorDispatcher = (
  error: AsaError,
  context?: { [key: string]: any }
) => Promise<Response>;

const submitEvent: EventDispatcher = ev =>
  EVENT({
    ev,
    t: new DateTime()
  });

const submitError: ErrorDispatcher = (err, context?) =>
  ERROR({ err, context, v: version });

export class API {
  private _dispatchEvent: EventDispatcher = submitEvent;
  private _dispatchError: ErrorDispatcher = submitError;
  private pendingSubmission: Event[] = [];
  private batchIntervalHandler;
  private done = true;

  public batchEvent(e): void {
    this.pendingSubmission.push(e);
  }

  public submitEvent: EventDispatcher = event => {
    return this._dispatchEvent(event);
  };

  public submitError: ErrorDispatcher = (error, context?) => {
    return this._dispatchError(error, context);
  };

  public batchOn(): void {
    this.batchIntervalHandler = setInterval(() => {
      try {
        if (this.pendingSubmission.length > 0 && this.done) {
          const batchSize = Math.min(this.pendingSubmission.length, 10);
          const events: Event[] = this.pendingSubmission.slice(0, batchSize);
          this.done = false;
          events.forEach(event =>
            submitEvent(event)
              .then(() => this.pendingSubmission.splice(0, events.length))
              .catch(logger.log)
          );
        }
      } catch (e) {
        logger.log("exception submitting", e);
      }
    }, 400);
  }

  public batchOff(): void {
    if (!this.batchIntervalHandler) {
      logger.log("cannot batch off, it is not on");
    } else {
      clearInterval(this.batchIntervalHandler);
    }
  }

  public override(
    eventDispatcher: EventDispatcher = this._dispatchEvent,
    errorDispatcher: ErrorDispatcher = this._dispatchError
  ): void {
    this._dispatchError = errorDispatcher;
    this._dispatchEvent = eventDispatcher;
  }

  public reset(): void {
    this._dispatchError = submitError;
    this._dispatchEvent = submitEvent;
  }
}

export default new API();
