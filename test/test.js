var hammond = require('../');
var assert = require('assert');
describe('George Hammond', function() {
  it('should read a config file', function() {
    process.argv = ['node', 'thing.js', '--config', './test/test-config.js'];
    var config = hammond();
    assert(config.serverSetting);
  });
  it('should read a custom named config file', function() {
    process.argv = ['node', 'thing.js', '--potato', './test/test-config.js'];
    var config = hammond('potato');
    assert(config.serverSetting);
  });
  it('should read a config file from an env var', function() {
    process.argv = ['node', 'thing.js'];
    process.env.potato = './test/test-config.js';
    var config = hammond('potato');
    assert(config.serverSetting);
  });
  it('should read a config file direct from argv', function() {
    process.argv = ['node', 'thing.js', '--config', '{"serverSetting":true}'];
    process.env.potato = './test/test-config.js';
    var config = hammond('config');
    assert(config.serverSetting);
  });
  it('should throw if the config is missing required keys', function() {
    process.argv = ['node', 'thing.js', '--config', './test/test-config.js'];
    assert.throws(function() {
      var config = hammond().requires(['someCrazyNewThing']);
    });
  });
  it('should inherit values', function() {
    process.argv = ['node', 'thing.js', '--config', './test/test-config.js'];
    var config = hammond();
    assert(config.globalSetting);
  });
  it('should get other services', function() {
    process.argv = ['node', 'thing.js', '--config', './test/test-config.js'];
    var config = hammond();
    assert(config.otherService == 'http://localhost:1234');
  });
});
