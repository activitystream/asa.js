import inbox, { Inbox } from "./inbox";

declare global {
  interface Window {
    asa: Inbox;
  }

  interface Document {}

  interface String {
    endsWith: (searchString: string, endPosition?: number) => boolean;
  }
}

const Window: { sessionStorage: Storage; location: Location; asa: Inbox } = {
  sessionStorage: window.sessionStorage,
  location: window.location,
  asa: inbox
};

const Document: any = {
  location: document.location,
  referrer: document.referrer
};

export { Window as window, Document as document };
