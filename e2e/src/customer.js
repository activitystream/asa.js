import fetch from "node-fetch";
import { inbox, sitea, siteb } from "./config";

const getLogs = () =>
  fetch(`${inbox}/log`, {
    method: "GET",
    mode: "cors"
  });

const wipeLogs = () =>
  fetch(`${inbox}/log`, {
    method: "DELETE",
    mode: "cors"
  });

const step = 500;
const timeout = 2000;

export default {
  beforeEach: (browser, done) => {
    wipeLogs().then(done);
  },
  "should send as.web.product.viewed sitea": browser => {
    browser
      .windowMaximize()
      .url(sitea)
      .pause(step)
      .waitForElementVisible("#site_a", timeout)
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(1);
            done();
          })
          .catch(console.error)
      )
      .pause(step);
  },

  "should send as.web.product.viewed siteb": browser => {
    browser
      .windowMaximize()
      .url(siteb)
      .pause(step)
      .waitForElementVisible("#site_b", timeout)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(1);
            done();
          })
          .catch(console.error)
      )
      .pause(step);
  },

  "sitea submitForm": browser => {
    browser
      .windowMaximize()
      .pause(step)
      .url("http://sitea.com")
      .pause(step)
      .waitForElementVisible("#site_a", timeout)
      .pause(step)
      .submitForm("#_form_")
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .pause(step);
  },

  "sitea click offer1": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .pause(step)
      .waitForElementVisible("#site_a", timeout)
      .pause(step)
      .click("#_offer1")
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .pause(step);
  },

  "sitea click twitter": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .pause(step)
      .waitForElementVisible("#site_a", timeout)
      .pause(step)
      .click("#_twitter")
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(1);
            done();
          })
          .catch(console.error)
      )
      .pause(step);
  },

  "sitea click link with no param": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .pause(step)
      .waitForElementVisible("#site_a", timeout)
      .pause(step)
      .click("#_link_no_param")
      .pause(step)
      .waitForElementVisible("#site_b", timeout)
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            const pageViewSiteB = logs.filter(
              d =>
                d &&
                d.ev &&
                (d.ev.type === "as.web.product.viewed" &&
                  d.ev.tenant === "AS-E2EAUTOTEST-B")
            );
            browser
              .expect(pageViewSiteB.length && pageViewSiteB[0].ev.partner_id)
              .to.equal("AS-E2EAUTOTEST-A");
            browser.expect(logs.length).to.equal(2);
            done();
          })
      )
      .pause(step);
  },

  "sitea click link with param": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .pause(step)
      .waitForElementVisible("#site_a", timeout)
      .pause(step)
      .click("#_link_with_param")
      .pause(step)
      .waitForElementVisible("#site_b", timeout)
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(eventLogs => {
            const pageViewSiteB = eventLogs.filter(function(d) {
              return (
                d &&
                d.ev &&
                (d.ev.type === "as.web.product.viewed" &&
                  d.ev.tenant === "AS-E2EAUTOTEST-B")
              );
            });

            browser
              .expect(pageViewSiteB.length && pageViewSiteB[0].ev.partner_id)
              .to.equal("AS-E2EAUTOTEST-A");
            browser.expect(eventLogs.length).to.equal(2);
            browser.expect(pageViewSiteB[0].ev.page.url.indexOf("sendmeover"));
            done();
          })
          .catch(console.error)
      )
      .pause(step);
  },

  "Newsletter -> sitea click link with param": browser => {
    browser
      .windowMaximize()
      .url(
        "http://sitea.com?utm_medium=Email&utm_source=Newsletter&utm_campaign=My_Newsletter&utm_content=Free&utm_term=February2017"
      )
      .pause(step)
      .waitForElementVisible("#site_a", timeout)
      .pause(step)
      .click("#_link_with_param")
      .pause(step)
      .waitForElementVisible("#site_b", timeout)
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(eventLogs => {
            eventLogs.forEach(d => {
              browser.expect(d.ev.campaign.campaign).to.equal("My_Newsletter");
              browser.expect(d.ev.campaign.source).to.equal("Newsletter");
              browser.expect(d.ev.campaign.medium).to.equal("Email");
              browser.expect(d.ev.campaign.term).to.equal("February2017");
              done();
            });
          })
      )
      .pause(step);
  },

  "Newsletter -> sitea -> read more -> siteb click link no param": browser => {
    browser
      .windowMaximize()
      .url(
        "http://sitea.com?utm_medium=Email&utm_source=Newsletter&utm_campaign=My_Newsletter&utm_content=Free&utm_term=February2017"
      )
      .pause(step)
      .waitForElementVisible("#site_a", timeout)
      .pause(step)
      .click("#_read_more")
      .pause(step)
      .waitForElementVisible("#site_a_read_more", timeout)
      .pause(step)
      .click("#_link_with_param")
      .pause(step)
      .waitForElementVisible("#site_b", timeout)
      .pause(step)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(eventLogs => {
            eventLogs
              .filter(d => d.type === "as.web.product.viewed")
              .forEach(d => {
                browser
                  .expect(d.ev.campaign.campaign)
                  .to.equal("My_Newsletter");
                browser.expect(d.ev.campaign.source).to.equal("Newsletter");
                browser.expect(d.ev.campaign.medium).to.equal("Email");
                browser.expect(d.ev.campaign.term).to.equal("February2017");
              });
            browser.expect(eventLogs.length).to.equal(3);
            done();
          })
          .catch(console.error)
      )
      .end();
  }
};
