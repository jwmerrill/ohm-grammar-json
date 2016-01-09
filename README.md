Ohm-JSON
========

JSON parser written using the [Ohm](https://github.com/cdglabs/ohm) parsing framework.

## Usage

```javascript
var json = require('ohm-json');

# Analogous to the built in JSON.parse
json.parse('{"a": "b"}');

# Match json and return an Ohm match stucture
json.grammar.match('{"a": "b"}');

# Ohm semantics object that contains the parser implementation
json.semantics
```

## Status

This is a personal experiment that I used to learn about Ohm. Not really inteded to be used for any purpose other than learning.
