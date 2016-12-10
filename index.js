'use strict';

/*!
 * window-size <https://github.com/jonschlinkert/window-size>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert
 * Licensed under the MIT license.
 */

var tty = require('tty');
var os = require('os');
var execSync = require('child_process').execSync;

module.exports = (function () {
  var width;
  var height;

  if (tty.isatty(1)) {
    if (process.stdout.getWindowSize) {
      width = process.stdout.getWindowSize(1)[0];
      height = process.stdout.getWindowSize(1)[1];
    } else if (tty.getWindowSize) {
      width = tty.getWindowSize()[1];
      height = tty.getWindowSize()[0];
    } else if (process.stdout.columns && process.stdout.rows) {
      height = process.stdout.rows;
      width = process.stdout.columns;
    }
  } else if (os.release().startsWith('10')) {
    var numberPattern = /\d+/g;
    var cmd = 'wmic path Win32_VideoController get CurrentHorizontalResolution,CurrentVerticalResolution';
    var code = execSync(cmd).toString('utf8');
    var res = code.match(numberPattern);
    return { height: ~~res[1], width: ~~res[0] };
  } else {
    return { height: undefined, width: undefined };
  }

  return {height: height, width: width};
})();
