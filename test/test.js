process.argv = ['node', 'thing.js', '--config', './test/test-config.json'];
var assert = require('assert');
var hammond = require('../');
describe('George Hammond', function() {
  it('should read a config file', function() {
    var config = require('../')('service');
    assert(config.serverSetting);
  });
  it('should throw if the config is missing required keys', function() {
    assert.throws(function() {
      var config = hammond('service', ['someCrazyNewThing']);
    });
  });
  it('should inherit values', function() {
    var config = hammond('service');
    assert(config.globalSetting);
  });
  it('should get other services', function() {
    var config = hammond('service');
    assert(config.otherService == 'http://localhost:1234');
  });
});
