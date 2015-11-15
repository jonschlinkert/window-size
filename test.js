var tap = require('tap');

tap.test('returns object with width and height', function (t) {
  var wsize = require('./');
  t.ok(~Object.keys(wsize).indexOf('width'));
  t.ok(~Object.keys(wsize).indexOf('height'));
  t.done();
});
