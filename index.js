var fs = require('fs');
var ohm = require('ohm-js');

var grammar = ohm.grammar(fs.readFileSync('src/json.ohm'));

var semantics = grammar.semantics();

function pair(k, v) { return { k: k, v: v }; }

semantics.addOperation('parse', {
  Object: function (_, e, _) {
    var pairs = e.buildArray();
    var out = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      out[pair.k] = pair.v;
    }
    return out;
  },
  Pair: function (k, _, v) {
    return pair(k.parse(), v.parse());
  },
  Array: function (_, e, _) {
    return e.buildArray();
  },
  String: function (_, e, _) {
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
  escapeSequence_codePoint: function (_, d1, d2, d3, d4) {
    var digits = (
      d1.interval.contents +
      d2.interval.contents +
      d3.interval.contents +
      d4.interval.contents
    );
    return String.fromCharCode(parseInt(digits, 16));
  },
  Number: function (e) { return parseFloat(e.interval.contents); },
  True: function (e) { return true; },
  False: function (e) { return false; },
  Null: function (e) { return null; }
});

semantics.addOperation('buildArray', {
  ListOf_none: function () { return []; },
  ListOf_some: function (x, _, xs) {
    return [x.parse()].concat(xs.parse());
  }
});

module.exports = {
  grammar: grammar,
  semantics: semantics
}
