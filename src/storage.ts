export const storageAPI = (): Storage => {
  let store: { [key: string]: string } = {};
  return {
    setItem(prop, value) {
      store[prop] = value;
    },
    getItem(prop) {
      return store[prop];
    },
    removeItem(prop) {
      delete store[prop];
    },
    clear() {
      store = {};
    },
    key(index: number) {
      return store[Object.keys(store)[index]];
    },
    get length() {
      return Object.keys(store).length;
    }
  };
};
