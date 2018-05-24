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

  constructor(options = {}) {
    this.options = { ...this.options, ...options };
  }

  parseURI(
    str
  ): {
    source?: any;
    protocol?: any;
    authority?: any;
    userInfo?: any;
    user?: any;
    password?: any;
    host?: any;
    port?: any;
    relative?: any;
    path?: any;
    directory?: any;
    file?: any;
    query?: any;
    anchor?: any;
    queryKey?: {
      __asa?: any;
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
