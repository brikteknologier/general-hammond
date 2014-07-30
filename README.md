# General Hammond

Reads your [cascading service config](http://github.com/brikteknologier/cascading-service-config)
file, [enforces](http://github.com/jonpacker/assert-keys) its content, and hands
it to you for immediate utilisation. You have a go.

![Lieutenant General George Hammond](http://i.imgur.com/DbO3Vkl.jpg)

## install

```
npm i general-Hammond
```

## `hammond([domain], [keys])`

* `domain` - the domain of the config to use (optional, no default) - see
  [cascading service config](http://github.com/brikteknologier/cascading-service-config)
  for more info
* `keys` - required keys in the config. see [assert keys](http://github.com/jonpacker/assert-keys)
  for more info. this is run *after* the config is parsed as a CSC.

returns a function that takes one argument, a callback. the callback is passed a
single argument, the config. If the config is not found or the fails to parse,
an error is thrown (it's assumed that you want the process to terminate at that
point)

## example

```javascript
require('general-hammond')('api-server', ['port'])(function(config) {
  // at this point it is guaranteed that the config was found and had a `port`
  // property set under the `api server` domain.
  http.createServer().listen(config.port);
});
```

## how to specify a config

General Hammond will look in several places for the config:

1. As a file or URL described by the `--config` command-line argument.
2. As a file, URL or JSON string described by the "CONFIG" environment variable.
3. As an object (not a JSON string, pre-CSC parsing), at `global.config`—this
   is most useful for supplying a configuration during testing, or other use cases
   the involve requiring the module the needs configuration.

## config overrides

You can override settings in the config by specifying the GH_CONFIG_OVERRIDE 
environment variable. The value should be a stringified JSON object with values
that override those in the config. The values are overlayed by using
[deep-extend](https://github.com/unclechu/node-deep-extend).

For example, given config.json `{"service": {"port": 2345, "name": "service!"}}`:

```
export GH_CONFIG_OVERRIDE='{"service":{"port":5678}}'
node service --config config.json
```

The service receives this config: `{"service": {"port": 5678, "name": "service!"}}`
