// old ie
if (!console) {
  (<any>window.console) = {};
}
if (!console.log) {
  window.console.log = () => {};
}

export class Logger {
  static none(...args: any[]): void {}
  static console(...args: any[]) {
    console.log("asa.js", ...args);
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
