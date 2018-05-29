import logger from "./logger";

const collectReferencedProperties = (element, item) => {
  const refString = element.getAttribute("itemref");
  if (refString) {
    const refs = refString.split(" ");
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      const refItem = document.getElementById(ref);
      if (refItem) {
        collectProperties(refItem, item);
      } else {
        logger.log("missing metadata element", ref);
      }
    }
  }
};

const collectComplexProperty = element => {
  const item = {
    type: element.getAttribute("itemtype"),
    properties: {}
  };
  collectReferencedProperties(element, item);
  collectProperties(element, item);
  return item;
};

const collectSimpleProperty = el => {
  const tag = el.tagName;
  switch (tag) {
    case "TIME":
      return el.getAttribute("datetime");
    case "A":
    case "LINK":
      return el.href;
    default:
      return el.getAttribute("content") || el.innerText || el.src;
  }
};

const collectProperties = ({ children }: HTMLElement, item) => {
  Array.prototype.forEach.call(children, child => {
    const prop = child.getAttribute("itemprop");
    if (prop) {
      if (child.getAttribute("itemscope")) {
        item.properties[prop] = collectComplexProperty(child);
      } else {
        item.properties[prop] = collectSimpleProperty(child);
      }
    }

    if (!child.getAttribute("itemscope")) {
      collectProperties(child, item);
    }
  });
};

const processElement = el => {
  if (el.hasAttribute("itemscope")) {
    let map = Array.prototype.reduce.call(
      el.children,
      (acc, curr) => ({
        ...acc,
        [curr.getAttribute("itemprop")]: processElement(curr)
      }),
      {}
    );

    if (el.getAttribute("itemtype")) {
      map = {
        type: el.getAttribute("itemtype"),
        properties: map
      };
    }

    return map;
  } else if (el.hasAttribute("itemprop")) {
    return el.getAttribute("content") || el.innerText || el.src;
  } else {
    return {
      __items: [].map.call(el.children, processElement)
    };
  }
};

export const extractFromHead = () =>
  _mapper(
    Array.prototype.reduce.call(
      document.querySelectorAll('head > meta[property^="og:"]'),
      (acc, curr) => ({
        ...acc,
        [curr.getAttribute("property")]: curr.getAttribute("content")
      }),
      {
        keywords:
          document.querySelector('head > meta[name="keywords"]') &&
          document
            .querySelector('head > meta[name="keywords"]')
            .getAttribute("content")
      }
    )
  );

export const noMapper = (m, n?) => m;

let _mapper = noMapper;

export const setMapper = mapper => {
  _mapper = (meta, el) => {
    try {
      return mapper(meta, el);
    } catch (e) {
      return meta;
    }
  };
};

export const extract = (selector: string): {} => {
  const elements =
    typeof selector === "string"
      ? document.querySelectorAll(selector)
      : selector;
  const data = [].map
    .call(elements, el => _mapper(processElement(el), el))
    .filter(d => d);

  return data.length > 1
    ? {
        __items: data
      }
    : data.pop();
};
