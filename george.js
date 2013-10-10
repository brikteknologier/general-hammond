var csc = require('cascading-service-config');
var assertkeys = require('assert-keys');
var argv = require('optimist').argv;
var getit = require('getit');
var augur = require('augur');
var assert = require('assert');

module.exports = function LieutenantGeneralGeorgeHammond(domain, keys) {
  if (Array.isArray(domain)) {
    keys = domain;
    domain = null;
  }

  var filename = argv.config;

  if (!filename) {
    throw new Error("No configuration specified! Please specify one with " +
                    "--config and try again");
  }

  var config = augur();
  getit(filename, config);

  return function(callback) {
    config.then(function(err, configstr) {
      assert(!err, err);
      var configobj = JSON.parse(configstr);
      if (domain != null) configobj = csc(configobj, domain);
      if (keys != null) assertkeys(keys)(configobj);
      callback(configobj);
    });
  };
}
