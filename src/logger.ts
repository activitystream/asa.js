/**
 * @module logger
 */

const log = (...message: any[]) => {
  try {
    console.log(...message);
  } catch (e) {
    // swallow error
  }
};

export class Logger {
  static none(...args: any[]): void {}
  static console(...args: any[]) {
    log("js", ...args);
  }

  private _logger: typeof Logger.none | typeof Logger.console = Logger.none;

  public mode(mode: boolean): void {
    this._logger = mode ? Logger.console : Logger.none;
  }

  public log(...args: any[]) {
    this._logger(...args);
  }

  public force(...args: any[]) {
    Logger.console(...args);
  }
}

export default new Logger();
