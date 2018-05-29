import parser from "./parseuri";

export default (location, referrer, serviceProviders) => {
  if (referrer && referrer.length > 0) {
    const referrerAuth = parser.parseURI(referrer).authority;
    const currentAuth = parser.parseURI(location).authority;
    if (
      referrerAuth != currentAuth &&
      serviceProviders.indexOf(referrerAuth) === -1
    ) {
      return referrer;
    }
  }
  return null;
};
