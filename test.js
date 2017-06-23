'use strict';

require('mocha');
var isCI = process.env.TRAVIS || process.env.APPVEYOR || process.env.CI;
var assert = require('assert');
var utils = require('./utils');
var size = require('./');
var tty = require('tty');

function override(obj) {
  var getWindowSize = obj.getWindowSize;
  var columns = obj.columns;
  var rows = obj.rows;

  obj.getWindowSize = null;
  obj.columns = null;
  obj.rows = null;

  return function() {
    obj.getWindowSize = getWindowSize;
    obj.columns = columns;
    obj.rows = rows;
  };
}

describe('window-size', function() {
  it('should return an object with width and height', function() {
    if (!process.env.APPVEYOR) {
      assert.equal(typeof size.width, 'number');
      assert.equal(typeof size.height, 'number');
    }
  });

  it('should expose a `.get` method to get up-to-date size', function() {
    if (!process.env.APPVEYOR) {
      var s = size.get();
      assert.equal(typeof s.width, 'number');
      assert.equal(typeof s.height, 'number');
    }
  });

  it('should get size from process.stdout', function() {
    if (!process.env.APPVEYOR) {
      var count = 0;
      var restore = override(process.stdout);
      process.stdout.getWindowSize = function() {
        count++;
      };

      size.get();
      restore();
      assert.equal(count, 1);
    }
  });

  it('should get size from process.stderr', function() {
    if (!process.env.APPVEYOR) {
      var restoreOut = override(process.stdout);
      var restoreErr = override(process.stderr);

      var count = 0;
      process.stderr.getWindowSize = function() {
        count++;
      };

      size.get();
      restoreOut();
      restoreErr();
      assert.equal(count, 1);
    }
  });

  it('should get size from process.env', function() {
    if (!process.env.APPVEYOR) {
      process.env.COLUMNS = 80;
      process.env.ROWS = 25;

      var s = size.env();
      assert(s);
      assert.equal(s.width, 80);
      assert.equal(s.height, 25);

      process.env.COLUMNS = null;
      process.env.ROWS = null;
    }
  });

  it('should get size from tty', function() {
    if (!process.env.APPVEYOR) {
      var restoreOut = override(process.stdout);
      var restoreErr = override(process.stderr);
      var restoreTty = override(tty);

      var count = 0;
      tty.getWindowSize = function() {
        count++;
      };

      size.get();
      restoreOut();
      restoreErr();
      restoreTty();
      assert.equal(count, 1);
    }
  });

  it('should get size from tput', function() {
    if (!isCI) {
      var s = size.tput();
      assert(s);
      assert.equal(typeof s.width, 'number');
      assert.equal(typeof s.height, 'number');
    }
  });

  describe('utils', function() {
    it('should expose a `.get` method to get up-to-date size', function() {
      var s = utils.get();
      if (process.env.APPVEYOR) {
        assert.equal(typeof s, 'undefined');
      } else {
        assert.equal(typeof s.width, 'number');
        assert.equal(typeof s.height, 'number');
      }
    });

    it('should get size from process.env', function() {
      process.env.COLUMNS = 80;
      process.env.ROWS = 25;

      var s = utils.env();
      assert(s);
      assert.equal(s.width, 80);
      assert.equal(s.height, 25);

      process.env.COLUMNS = null;
      process.env.ROWS = null;
    });

    it('should get size from tty', function() {
      var restoreTty = override(tty);

      var count = 0;
      tty.getWindowSize = function() {
        count++;
      };

      utils.tty({});
      restoreTty();
      assert.equal(count, 1);
    });

    it('should get size from tput', function() {
      if (!isCI) {
        var s = utils.tput();
        assert(s);
        assert.equal(typeof s.width, 'number');
        assert.equal(typeof s.height, 'number');
      }
    });
  });
});

