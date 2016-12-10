/*!
 * window-size <https://github.com/jonschlinkert/window-size>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert
 * Licensed under the MIT license.
 */

'use strict';

var extend = require('extend-shallow');

function windowSize(options) {
  var opts = extend({ width: 78, height: 0 }, options);
  var stdout = opts.stdout || process.stdout;
  var tty = opts.tty || require('tty');

  if (typeof stdout.getWindowSize === 'function') {
    return {
      height: stdout.getWindowSize(1)[1],
      width: stdout.getWindowSize(1)[0]
    };
  }

  if (typeof tty.getWindowSize === 'function') {
    return {
      height: tty.getWindowSize()[1],
      width: tty.getWindowSize()[0]
    };
  }

  return {
    width: stdout.columns || opts.width,
    height: stdout.rows || opts.height
  };
}

/**
 * Expose `create` method
 */

windowSize.create = windowSize;

/**
 * Expose window-size using our defaults
 */

module.exports = windowSize();
