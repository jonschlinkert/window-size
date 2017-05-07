var size = require('./');
var wrap = require('justified');

var text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

function opts(margin) {
  process.stdout.write('\x1bc');
  var width = size.get().width - (margin * 3);
  return {indent: margin, width: width};
}

console.log(wrap(text, opts(12)));

process.stdout.on('resize', function() {
  console.log(wrap(text, opts(12)));
});

setInterval(function() {
}, 0);
