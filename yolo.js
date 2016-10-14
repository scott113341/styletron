const CSSOM = require('cssom');
const fs = require('fs');
const gzipSize = require('gzip-size');

const StyletronServer = require('./packages/styletron-server/lib/styletron-server.js');

const css = fs.readFileSync('./packages/benchmarks/fixtures/css/uber.css').toString();
const parsedCss = CSSOM.parse(css);

const server = new StyletronServer();
let totalRules = 0;

parsedCss.cssRules.forEach(rule => {
  if (rule.style) {
    for (let i = 0; i < rule.style.length; i++) {
      const prop = rule.style[i];
      const val = rule.style[prop];
      server.injectDeclaration({ prop, val });
      totalRules++;
    }
  }
});

const html = server.getStylesheetsHtml();
const size = gzipSize.sync(html);

console.log('total rules:', totalRules);
console.log('unique rules:', server.uniqueCount);
console.log('original length:', css.length);
console.log('styletron length:', html.length);
console.log('gzipped length:', size);
