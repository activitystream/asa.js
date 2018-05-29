export * from "./sha1";

export const hash = d => {
  let a = 1;
  let c = 0;
  let h;
  let o;
  if (d) {
    a = 0;
    for (h = d["length"] - 1; h >= 0; h--) {
      o = d.charCodeAt(h);
      a = ((a << 6) & 268435455) + o + (o << 14);
      c = a & 266338304;
      a = c != 0 ? a ^ (c >> 21) : a;
    }
  }
  return a;
};
/* jshint ignore:end */
