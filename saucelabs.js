var Cloud = require('./mocha-sauce');
var cloud = new Cloud('acceptance-test', 'as-builder', 'e5eeb7c4-05f3-42ba-9135-9d09cbd99498', 'selenium', process.env.PORT);
cloud.browser('firefox', '', 'Linux');
// cloud.browser('chrome', '', 'Mac');
// cloud.browser('phantomjs', '', 'Mac');
// cloud.browser('safari', '', 'Mac');
// cloud.browser('internet explorer', '9.0', 'windows 7');
// cloud.browser('internet explorer', '10.0', 'windows 7');
// cloud.browser('internet explorer', '11.0', 'windows 7');
// cloud.browser('', '9.0', 'Mac', 'iPad Simulator');
// cloud.browser('', '8.0', 'Mac', 'iPad Simulator');
// cloud.browser('', '7.0', 'Mac', 'iPad Simulator');
cloud.url('http://web:8080/test.html');
 
cloud.on('init', function(browser){
  console.log('  init : %s %s', browser.id(), browser.version);
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
