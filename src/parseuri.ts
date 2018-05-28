// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

export const PARSER = {
  STRICT: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
  LOOSE: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
};

export const defaults = {
  strictMode: false,
  key: [
    "source",
    "protocol",
    "authority",
    "userInfo",
    "user",
    "password",
    "host",
    "port",
    "relative",
    "path",
    "directory",
    "file",
    "query",
    "anchor"
  ],
  q: {
    name: "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: PARSER.LOOSE
};

export class Parser {
  private options = defaults;

  getAuthority(str: Location | string) {
    return this.parseURI(typeof str !== "string" ? str.href : str).authority;
  }

  constructor(options = {}) {
    this.options = { ...this.options, ...options };
  }

  parseURI(
    str: string
  ): {
    source?: string;
    protocol?: string;
    authority?: string;
    userInfo?: string;
    user?: string;
    password?: string;
    host?: string;
    port?: string;
    relative?: string;
    path?: string;
    directory?: string;
    file?: string;
    query?: string;
    anchor?: string;
    queryKey?: {
      __asa?: string;
    };
  } {
    const match = this.options.parser.exec(str);
    const uri = {};
    let i = 14;

    while (i--) uri[this.options.key[i]] = match[i] || "";

    uri[this.options.q.name] = {};
    uri[this.options.key[12]].replace(this.options.q.parser, ($0, $1, $2) => {
      if ($1) uri[this.options.q.name][$1] = $2;
    });

    return uri;
  }
}

export default new Parser();
