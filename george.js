var csc = require('cascading-service-config');
var assertkeys = require('assert-keys');
var argv = require('optimist').argv;
var read = require('fs').readFileSync;
var resolve = require('path').resolve;

module.exports = function LieutenantGeneralGeorgeHammond(domain, keys) {
  if (Array.isArray(domain)) {
    keys = domain;
    domain = null;
  }

  var config = null;
  var filename = argv.config;

  if (!filename) {
    throw new Error("No configuration specified! Please specify one with " +
                    "--config and try again");
  }

  try {
    config = JSON.parse(filename);
  } catch(e) {}

  if (!config) {
    try {
      var filePath = resolve(process.cwd(), filename);
      config = JSON.parse(read(filePath));
    } catch(e) {
      throw new Error("Couldn't read configuration file '" + filePath + "'");
    }
  }

  if (domain != null) config = csc(config, domain);
  if (keys != null) assertkeys(keys)(config);

  return config; 
}
