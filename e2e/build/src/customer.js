'use strict';

var __chunk_1 = require('../node_modules/node-fetch/lib/index.es.js');
var config = require('./config.js');

const getLogs = () =>
  __chunk_1.default(`${config.inbox}/log`, {
    method: "GET",
    mode: "cors"
  });

function wipeLogs() {
  return __chunk_1.default(`${config.inbox}/log`, {
    method: "DELETE",
    mode: "cors"
  });
}

var customer = {
  beforeEach: (browser, done) => {
    wipeLogs().then(done);
  },
  "should send page.viewed sitea": browser => {
    browser
      .windowMaximize()
      .windowMaximize()
      .url(config.sitea)
      .waitForElementVisible("#site_a", 2000)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .end();
  },

  "should send page.viewed siteb": browser => {
    browser
      .windowMaximize()
      .url(config.siteb)
      .waitForElementVisible("#site_b", 2000)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .end();
  },

  "sitea submitForm": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .waitForElementVisible("#site_a", 2000)
      .submitForm("#_form_")
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .end();
  },

  "sitea click offer1": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .waitForElementVisible("#site_a", 2000)
      .click("#_offer1")
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(4);
            done();
          })
          .catch(console.error)
      )
      .end();
  },

  "sitea click twitter": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .waitForElementVisible("#site_a", 2000)
      .click("#_twitter")
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(2);
            done();
          })
          .catch(console.error)
      )
      .end();
  },

  "sitea click link with no param": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .waitForElementVisible("#site_a", 2000)
      .click("#_link_no_param")
      .waitForElementVisible("#site_b", 2000)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(4);
            done();
          })
          .catch(console.error)
      )
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            const pageViewSiteB = logs.filter(
              d =>
                d &&
                d.ev &&
                (d.ev.type === "page.viewed" &&
                  d.ev.tenant_id === "AS-E2EAUTOTEST-B")
            );
            browser
              .expect(pageViewSiteB.length && pageViewSiteB[0].ev.partner_id)
              .to.equal("AS-E2EAUTOTEST-A");
            browser.expect(logs.length).to.equal(4);
            done();
          })
      )
      .end();
  },

  "sitea click link with param": browser => {
    browser
      .windowMaximize()
      .url("http://sitea.com")
      .waitForElementVisible("#site_a", 2000)
      .click("#_link_with_param")
      .waitForElementVisible("#site_b", 2000)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(4);
            done();
          })
          .catch(console.error)
      )
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(eventLogs => {
            const pageViewSiteB = eventLogs.filter(function(d) {
              return (
                d &&
                d.ev &&
                (d.ev.type === "page.viewed" &&
                  d.ev.tenant_id === "AS-E2EAUTOTEST-B")
              );
            });

            browser
              .expect(pageViewSiteB.length && pageViewSiteB[0].ev.partner_id)
              .to.equal("AS-E2EAUTOTEST-A");
            browser.expect(eventLogs.length).to.equal(4);
            browser.expect(pageViewSiteB[0].ev.page.url.indexOf("sendmeover"));
            done();
          })
          .catch(console.error)
      )
      .end();
  },

  "Newsletter -> sitea click link with param": browser => {
    browser
      .windowMaximize()
      .url(
        "http://sitea.com?utm_medium=Email&utm_source=Newsletter&utm_campaign=My_Newsletter&utm_content=Free&utm_term=February2017"
      )
      .waitForElementVisible("#site_a", 2000)
      .click("#_link_with_param")
      .waitForElementVisible("#site_b", 2000)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(4);
            done();
          })
          .catch(console.error)
      )
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
      .end();
  },

  "Newsletter -> sitea -> read more -> siteb click link no param": browser => {
    browser
      .windowMaximize()
      .url(
        "http://sitea.com?utm_medium=Email&utm_source=Newsletter&utm_campaign=My_Newsletter&utm_content=Free&utm_term=February2017"
      )
      .waitForElementVisible("#site_a", 10000)
      .click("#_read_more")
      .waitForElementVisible("#site_a_read_more", 10000)
      .click("#_link_with_param")
      .waitForElementVisible("#site_b", 10000)
      .perform(done =>
        getLogs()
          .then(r => r.json())
          .then(logs => {
            browser.expect(logs.length).to.equal(4);
            getLogs()
              .then(r => r.json())
              .then(eventLogs => {
                eventLogs.filter(d => d.type === "page.viewed").forEach(d => {
                  browser
                    .expect(d.ev.campaign.campaign)
                    .to.equal("My_Newsletter");
                  browser.expect(d.ev.campaign.source).to.equal("Newsletter");
                  browser.expect(d.ev.campaign.medium).to.equal("Email");
                  browser.expect(d.ev.campaign.term).to.equal("February2017");
                });
                browser.expect(eventLogs.length).to.equal(4);
                done();
              })
              .catch(console.error);
          })
          .catch(console.error)
      )
      .end();
  }
};

module.exports = customer;
