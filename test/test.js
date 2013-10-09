process.argv = ['node', 'thing.js', '--config', './test/test-config.json'];
var assert = require('assert');
var hammond = require('../');
var http = require('http');
describe('George Hammond', function() {
  it('should read a config file', function() {
    var config = require('../')('service');
    assert(config.serverSetting);
  });
  it('should throw if the config is missing required keys', function() {
    assert.throws(function() {
      var config = hammond('service', ['someCrazyNewThing'])(function(cfg){});
    });
  });
  it('should inherit values', function(done) {
    hammond('service')(function(config) {
      assert(config.globalSetting);
      done()
    });
  });
  it('should get other services', function(done) {
    hammond('service')(function(config) {
      assert(config.otherService == 'http://localhost:1234');
      done()
    });
  });
  it('should retrieve a config from an arbitrary location', function(done) {
    var server = http.createServer(function(req,res) {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      var confstream = require('fs').createReadStream('./test/test-config.json');
      confstream.pipe(res);
    }).listen(62853);
    process.argv = ['node', 'thing.js', '--config', 'http://localhost:62853'];
    hammond('service')(function(config) {
      assert(config.globalSetting);
      done();
    });
  });
});
