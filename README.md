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
