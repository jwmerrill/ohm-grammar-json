"use strict";

var grammar = require('./json-grammar');
var semantics = grammar.semantics();

semantics.addOperation('parse', {
  Object_empty: function (_1, _2) { return {}; },
  Object_nonEmpty: function (_1, x, _3, xs, _5) {
    var out = {};
    var k = x.children[0].parse();
    var v = x.children[2].parse();
    out[k] = v;
    for (var i = 0; i < xs.children.length; i++) {
      var c = xs.children[i];
      k = c.children[0].parse();
      v = c.children[2].parse();
      out[k] = v;
    }
    return out;
  },
  Array_empty: function (_1, _2) {
    return [];
  },
  Array_nonEmpty: function (_1, x, _3, xs, _5) {
    var out = [x.parse()];
    for (var i = 0; i < xs.children.length; i++) {
      out.push(xs.children[i].parse());
    }
    return out;
  },
  stringLiteral: function (_1, e, _3) {
    // TODO would it be more efficient to try to capture runs of unescaped
    // characters directly?
    return e.children.map(function (c) { return c.parse(); }).join("");
  },
  doubleStringCharacter_nonEscaped: function (e) {
    return e.interval.contents;
  },
  doubleStringCharacter_escaped: function (_, e) {
    return e.parse();
  },
  escapeSequence_doubleQuote: function (e) { return '"'; },
  escapeSequence_reverseSolidus: function (e) { return '\\'; },
  escapeSequence_solidus: function (e) { return '/'; },
  escapeSequence_backspace: function (e) { return '\b'; },
  escapeSequence_formfeed: function (e) { return '\f'; },
  escapeSequence_newline: function (e) { return '\n'; },
  escapeSequence_carriageReturn: function (e) { return '\r'; },
  escapeSequence_horizontalTab: function (e) { return '\t'; },
  escapeSequence_codePoint: function (_, e) {
    return String.fromCharCode(parseInt(e.interval.contents, 16));
  },
  Number: function (e) { return parseFloat(e.interval.contents); },
  True: function (e) { return true; },
  False: function (e) { return false; },
  Null: function (e) { return null; }
});

function parse(str) {
  var match = grammar.match(str);
  if (match.failed()) throw new Error(match.message);
  return semantics(match).parse();
}

module.exports = {
  parse: parse,
  semantics: semantics
};
