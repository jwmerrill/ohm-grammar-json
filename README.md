ohm-grammar-json
================
[![Build Status](https://travis-ci.org/jwmerrill/ohm-grammar-json.svg?branch=master)](https://travis-ci.org/jwmerrill/ohm-grammar-json)

JSON parser written using the [Ohm](https://github.com/cdglabs/ohm) parsing framework.

## Installation

```bash
npm install ohm-grammar-json
```

## Usage

```javascript
var json = require('ohm-grammar-json');
```

Analogous to Javascript's built in `JSON.parse`:
```javascript
json.parse('{"a": "b"}')
```

The Ohm [grammar](https://github.com/cdglabs/ohm/blob/master/doc/api-reference.md#instantiating-grammars) and [semantics](https://github.com/cdglabs/ohm/blob/master/doc/api-reference.md#semantics) objects are available:
```javascript
json.grammar
json.semantics
```

Match json and return an Ohm [match stucture](https://github.com/cdglabs/ohm/blob/master/doc/api-reference.md#matchresult-objects):
```javascript
json.grammar.match('{"a": "b"}') // Returns a grammar object
json.grammar.match('{"a": "b"}').succeeded() // true
json.grammar.match('["Unclosed array"').succeeded() // false
json.grammar.match('["Unclosed array"').message // Error message
```

## Testing

```bash
# Pull in submodules (nativejson-benchmark)
git submodule init --update

# Install dev dependencies
npm install

# Run tests
npm test
```

## Pretty Printer example

There is an example JSON pretty printer implemented in `examples/pretty-printer.js`. The purpose of this example is to demonstrate

  1. Creating a new semantic operation on top of an existing grammar.
  2. Writing a semantic operation that depends on a context.

Example usage:

```javascript
var PrettyPrinter = require('ohm-grammar-json/examples/pretty-printer');

var str = PrettyPrinter.prettyPrint('{"a":"b","c":[1,2,[true,false,null],6.7]}');

console.log(str);
```

Output:

```json
{
  "a": "b",
  "c": [
    1,
    2,
    [
      true,
      false,
      null
    ],
    6.7
  ]
}
```

## Status

This package is intended as a demonstration of the Ohm parsing framework. If you want to parse or pretty print JSON in javascript, I recommend using the built in `JSON.parse` and `JSON.stringify` functions.

This project is intended to conform to [ECMA 404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf) and as far as I know, it does.
