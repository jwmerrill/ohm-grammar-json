var fs = require('fs');
var ohm = require('ohm-js');

var grammar = ohm.grammar(fs.readFileSync('src/json.ohm'));

var semantics = grammar.semantics();

semantics.addOperation('parse', {
  Object_empty: function (_, _) { return {}; },
  Object_nonEmpty: function (_, x, _, xs, _) {
    var out = {};
    var k = x.children[0].parse();
    var v = x.children[2].parse();
    out[k] = v;
    for (var i = 0; i < xs.children.length; i++) {
      var c = xs.children[i];
      var k = c.children[0].parse();
      var v = c.children[2].parse();
      out[k] = v;
    }
    return out;
  },
  Array_empty: function (_, _) {
    return [];
  },
  Array_nonEmpty: function (_, x, _, xs, _) {
    var out = [x.parse()];
    for (var i = 0; i < xs.children.length; i++) {
      out.push(xs.children[i].parse());
    }
    return out;
  },
  stringLiteral: function (_, e, _) {
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

function parse(str) {
  var match = grammar.match(str);
  if (match.failed()) throw new Error(match.message);
  return semantics(match).parse();
}

module.exports = {
  grammar: grammar,
  semantics: semantics,
  parse: parse
}
