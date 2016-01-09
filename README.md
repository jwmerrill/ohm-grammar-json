Ohm-JSON
========

JSON parser written using the [Ohm](https://github.com/cdglabs/ohm) parsing framework.

## Usage

```javascript
var json = require('ohm-json');
```

Analogous to the built in JSON.parse
```javascript
json.parse('{"a": "b"}');
```

The Ohm [grammar](https://github.com/cdglabs/ohm/blob/master/doc/api-reference.md#instantiating-grammars) and [semantics](https://github.com/cdglabs/ohm/blob/master/doc/api-reference.md#semantics) objects are available
```javascript
json.grammar
json.semantics
```

Match json and return an Ohm [match stucture](https://github.com/cdglabs/ohm/blob/master/doc/api-reference.md#matchresult-objects)
```javascript
json.grammar.match('{"a": "b"}');
```

## Testing

```bash
# Pull in submodules (nativejson-benchmark)
git submodule init --update

# Install dev dependencies
npm install --dev

# Run tests
npm test
```

## Status

This is a personal experiment that I used to learn about Ohm. Not really inteded to be used for any purpose other than learning.
