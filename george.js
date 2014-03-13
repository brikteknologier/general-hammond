var csc = require('cascading-service-config');
var assertkeys = require('assert-keys');
var argv = require('optimist').argv;
var getit = require('getit');
var augur = require('augur');
var assert = require('assert');
var deepExtend = require('deep-extend');

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

  var override;
  if (process.env.GH_CONFIG_OVERRIDE) {
    try { 
      override = JSON.parse(process.env.GH_CONFIG_OVERRIDE);
    } catch (e) {
      throw new Error("GH_CONFIG_OVERRIDE was specified by couldn't be parsed as JSON - " + e);
    }
  }

  var config = augur();
  getit(filename, config);

  return function(callback) {
    config.then(function(err, configstr) {
      assert(!err, err);
      var configobj = JSON.parse(configstr);
      if (override != null) deepExtend(configobj, override);
      if (domain != null) configobj = csc(configobj, domain);
      if (keys != null) assertkeys(keys)(configobj);
      callback(configobj);
    });
  };
}
