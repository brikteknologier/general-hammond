var assert = require('assert');
var http = require('http');
var domain = require('domain');
describe('George Hammond', function() {
  beforeEach(function() {
    delete require.cache[require.resolve('optimist')];
    delete require.cache[require.resolve('../')];
  });
  describe('read from command line arg', function() {
    var oldArgv = null;
    beforeEach(function() {
      oldArgv = process.argv;
      process.argv = ['node', 'thing.js', '--config', './test/test-config.json'];
    });
    afterEach(function() {
      process.argv = oldArgv;
    })
    it('should read a config file', function(done) {
      var config = require('../')('service')(function(config) {
        assert(config.serverSetting);
        done()
      });
    });
    it('should throw if the config is missing required keys', function(done) {
      var d = domain.create();
      var didError = false;
      d.on('error', function() {
        didError = true;
        d.exit();
        done();
      });
      d.run(function() {
        require('../')('service', ['someCrazyNewThing'])(function(){
          assert(didError);
          d.exit();
        });
      });
    });
    it('should inherit values', function(done) {
      require('../')('service')(function(config) {
        assert(config.globalSetting);
        done()
      });
    });
    it('should get other services', function(done) {
      require('../')('service')(function(config) {
        assert(config.otherService == 'http://localhost:1234');
        done()
      });
    });
    it('should use env overrides', function(done) {
      process.env.GH_CONFIG_OVERRIDE = JSON.stringify({ service: { port: 8010 } })
      require('../')()(function(config) {
        assert(config.service.port  == 8010);
        delete process.env.GH_CONFIG_OVERRIDE;
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
      require('../')('service')(function(config) {
        assert(config.globalSetting);
        server.close(done);
      });
    });
  });
  describe('read from env var', function() {
    beforeEach(function() {
      process.env.CONFIG = './test/test-config.json';
    });
    afterEach(function() {
      delete process.env.CONFIG;
    })
    it('should read a config file', function(done) {
      var config = require('../')('service')(function(config) {
        assert(config.serverSetting);
        done()
      });
    });
    it('should use env overrides', function(done) {
      process.env.GH_CONFIG_OVERRIDE = JSON.stringify({ service: { port: 8010 } })
      require('../')()(function(config) {
        assert(config.service.port  == 8010);
        delete process.env.GH_CONFIG_OVERRIDE;
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
      process.env.CONFIG  = 'http://localhost:62853';
      require('../')('service')(function(config) {
        assert(config.globalSetting);
        server.close(done);
      });
    });
    it('should read a raw config from an env var', function(done){ 
      var conf = require('fs').readFileSync('./test/test-config.json');
      process.env.CONFIG = conf;
      require('../')('service')(function(config) {
        assert(config.globalSetting);
        done();
      });
    });
    it('should read a parsed raw config from an env var', function(done){ 
      var conf = require('fs').readFileSync('./test/test-config.json');
      global.config = JSON.parse(conf);
      delete process.env.CONFIG;
      require('../')('service')(function(config) {
        assert(config.globalSetting);
        delete global.config;
        done();
      });
    });
  });
});
