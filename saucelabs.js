var Cloud = require('./mocha-sauce');
var cloud = new Cloud('acceptance-test', process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY, 'selenium', process.env.PORT);

var browser = process.env.TEST_BROWSER || 'firefox';
var browserVer = process.env.TEST_BROWSER_VER || '';
var os = process.env.TEST_OS || 'linux';
cloud.browser(browser, browserVer, os);

cloud.url('http://web:8080/test.html?utm_campaign=testCampaign&utm_source=testSource');
 
cloud.on('init', function(browser){
  console.log('  init : ', JSON.stringify(browser));
});
 
cloud.on('start', function(browser){
  console.log('  start : %s %s', browser.id(), browser.version);
});
 
cloud.on('end', function(browser, res){
  console.log('  end : %s %s : %d failures', browser.id() , browser.version, res.failures);
  if (res.failures > 0){
    for (var i = 0; i < res.reports.length; i++) {
      var report = res.reports[i];
      console.log('Error in "', report.name, '"');
      console.log('Stacktrace:\n', report.stack);      
    }
  }
});
 
cloud.start(function(err){
  process.exit(err === null ? 0 : 1);
});
