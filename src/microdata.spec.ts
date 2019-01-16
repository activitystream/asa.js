import * as m from "./microdata";

export default describe("microdata", () => {
  it("should extract metadata from DOM element with a single metadata root", () => {
    const data = m.extract("#offer1");

    console.log(data);

    expect(data).toEqual({
      type: "http://schema.org/Offer",
      properties: {
        name: "Blend-O-Matic",
        price: "$19.95",
        reviews: {
          type: "http://schema.org/AggregateRating",
          properties: { ratingValue: "4", bestRating: "5", ratingCount: "25" }
        }
      }
    });
  });

  it("should extract metadata from DOM element with multiple metadata roots", () => {
    const data = m.extract("#multiple_meta_items");

    expect(data).toEqual({
      __items: [
        {
          type: "http://schema.org/Offer",
          properties: {
            name: "Blend-O-Matic1",
            price: "$19.95",
            reviews: {
              type: "http://schema.org/AggregateRating",
              properties: {
                ratingValue: "4",
                bestRating: "5",
                ratingCount: "25"
              }
            }
          }
        },
        {
          type: "http://schema.org/Offer",
          properties: {
            name: "Blend-O-Matic2",
            price: "$19.95",
            reviews: {
              type: "http://schema.org/AggregateRating",
              properties: {
                ratingValue: "4",
                bestRating: "5",
                ratingCount: "25"
              }
            }
          }
        }
      ]
    });
  });

  it("should extract metadata from document HEAD", () => {
    const data = m.extractFromHead();

    expect(data).toEqual({
      "og:description":
        "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.",
      "og:url": "http://operaen.no/",
      "og:title":
        "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett",
      "og:site_name": "Operaen.no",
      "og:type": "website",
      keywords:
        "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter"
    });
  });

  describe("meta-data mapper", () => {
    it("should be able to replace each extracted piece of metadata", () => {
      m.setMapper(() => ({
        c: "d"
      }));
      const data = m.extractFromHead();
      expect(data).toEqual({ c: "d" });
    });
    it("should be able to convert metadata", () => {
      m.setMapper(meta => ({
        c: "d",
        d: meta["og:description"]
      }));
      const data = m.extractFromHead();
      expect(data).toEqual({
        c: "d",
        d:
          "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud."
      });
    });
    it('should be "transparent" mappig using the noMapper', () => {
      expect(m.noMapper("dfd")).toBe("dfd");
    });
    it("should provide metadata and DOM tree root element it was extracted from", done => {
      m.setMapper((meta: any, el) => {
        expect(el.getAttribute("id")).toBe("offer1");
        expect(el.getAttribute("data-event-id")).toBe("123");
        done();
      });
      m.extract("#offer1");
    });
    it("should provide only metadata and no DOM tree root element when extracting from HEAD", done => {
      m.setMapper((meta, el) => {
        expect(el).toBeUndefined();
        done();
      });
      m.extractFromHead();
    });
    it("should handle mapper failure", () => {
      m.setMapper((meta, el) => {
        throw Error();
      });
      const headerMeta = m.extractFromHead();
      expect(headerMeta).toEqual({
        "og:description":
          "Velkommen til Den Norske Opera & Ballett. Her finner du informasjon om våre forestillinger, opera, ballett, konserter og andre kulturtilbud.",
        "og:url": "http://operaen.no/",
        "og:title":
          "Opera, Ballett og Konserter | Operaen  \\ Den Norske Opera & Ballett",
        "og:site_name": "Operaen.no",
        "og:type": "website",
        keywords:
          "Den Norske Opera & Ballett, operaen, ballett, nasjonalballetten, nasjonaloperaen, operahuset, konserter, operakoret, operaorkestret, Operaen, forestillinger, operabutikken, opera, Oslo, oslo opera, operaballetten, konserter"
      });
    });
  });
});
