import inbox from "./dispatcher";

const Window: {
  sessionStorage: Storage;
  location: Location;
} = {
  sessionStorage: window.sessionStorage,
  location: window.location
};

const Document: any = {
  location: document.location,
  referrer: document.referrer
};

export { Window as window, Document as document };
