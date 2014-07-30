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

  var filename = argv.config || process.env.CONFIG || global.config;

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

  if (typeof filename == 'string') {
    try {
      var parsedConfig = JSON.parse(filename);
      if (typeof parsedConfig == 'object') config(null, parsedConfig);
      else getit(filename, config);
    } catch (e) {
      getit(filename, config);
    }
  } else {
    config(null, filename);
  }

  return function(callback) {
    config.then(function(err, configjson) {
      assert(!err, err);
      var configobj = typeof configjson == 'string' ? JSON.parse(configjson) : configjson;
      if (override != null) deepExtend(configobj, override);
      if (domain != null) configobj = csc(configobj, domain);
      if (keys != null) assertkeys(keys)(configobj);
      callback(configobj);
    });
  };
}
