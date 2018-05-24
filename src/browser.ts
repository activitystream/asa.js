import { WebEvent } from "./event";

declare global {
  interface Window {
    asa: any;
  }

  interface Document {}

  interface String {
    endsWith: (searchString: string, endPosition?: number) => boolean;
  }
}

const Window = {
  sessionStorage: window.sessionStorage,
  location: window.location,
  set asa(instance) {
    window.asa = instance;
  },
  get asa() {
    return window.asa;
  }
};

const Document: any = {
  location: document.location,
  referrer: document.referrer
};

export { Window as window, Document as document };
