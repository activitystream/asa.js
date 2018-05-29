import inbox, { Dispatcher } from "./dispatcher";

declare global {
  interface Window {
    asa: Dispatcher;
  }

  interface Document {}

  interface String {
    endsWith: (searchString: string, endPosition?: number) => boolean;
  }
}

const Window: {
  sessionStorage: Storage;
  location: Location;
  asa: Dispatcher;
} = {
  sessionStorage: window.sessionStorage,
  location: window.location,
  asa: inbox
};

const Document: any = {
  location: document.location,
  referrer: document.referrer
};

export { Window as window, Document as document };
