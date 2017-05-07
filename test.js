'use strict';

require('mocha');
var isCI = process.env.TRAVIS || process.env.CI;
var assert = require('assert');
var size = require('./');
var tty = require('tty');

describe('window-size', function() {
  it('should return an object with width and height', function() {
    assert.equal(typeof size.width, 'number');
    assert.equal(typeof size.height, 'number');
  });

  it('should expose a `.get` method to get up-to-date size', function() {
    var s = size.get();
    assert.equal(typeof s.width, 'number');
    assert.equal(typeof s.height, 'number');
  });

  it('should get size from process.stdout', function() {
    var count = 0;
    process.stdout.getWindowSize = function() {
      count++;
    };

    size.get();
    assert.equal(count, 1);
  });

  it('should get size from process.stderr', function() {
    var count = 0;
    process.stdout.getWindowSize = null;
    process.stdout.columns = null;
    process.stdout.rows = null;
    process.stderr.getWindowSize = function() {
      count++;
    };

    size.get();
    assert.equal(count, 1);
  });

  it('should get size from process.env', function() {
    process.env.COLUMNS = 80;
    process.env.ROWS = 25;

    var s = size.env();
    assert(s);
    assert.equal(s.width, 80);
    assert.equal(s.height, 25);

    process.env.COLUMNS = null;
    process.env.ROWS = null;
  });

  it('should get size from tty', function() {
    var count = 0;

    process.stdout.getWindowSize = null;
    process.stdout.columns = null;
    process.stdout.rows = null;
    process.stderr.getWindowSize = null;
    process.stderr.columns = null;
    process.stderr.rows = null;

    tty.getWindowSize = function() {
      count++;
    };

    size.get();
    assert.equal(count, 1);
  });

  it('should get size from tput', function() {
    if (!isCI) {
      var s = size.tput();
      assert(s);
      assert.equal(typeof s.width, 'number');
      assert.equal(typeof s.height, 'number');
    }
  });
});

