#!/usr/bin/env node

var size = require('./');
var helpText = [
  'Usage',
  '  $ window-size',
  '',
  'Example',
  '  $ window-size',
  '  height: 40 ',
  '  width : 145',
  ''
].join('\n');

function showSize() {
  // size may be an empty object when the terminal size cannot be determined
  // (e.g. stdout redirected through `tee` / process substitution). Avoid a
  // TypeError on `.height` / `.width` — see #17.
  if (!size || typeof size.height !== 'number' || typeof size.width !== 'number') {
    console.error('window-size: unable to determine terminal size (is output redirected?)');
    process.exitCode = 1;
    return;
  }
  console.log('height: ' + size.height);
  console.log('width : ' + size.width);
}

switch (process.argv[2]) {
  case 'help':
  case '--help':
  case '-h':
    console.log(helpText);
    break;
  default: {
    showSize();
    break;
  }
}
