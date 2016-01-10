var json = require('../index');

// Make a new semantics instead of mutating the existing one. Is this
// the right thing to do? Pretty printer depends on existing grammar,
// but not parser semantics.
var semantics = json.grammar.semantics();

// The printyPrint semantic operation is designed to take a generic
// context that implements this interface, so you could write your
// own context if you wanted to handle whitespace differently, or write
// to a stream, or something like that.
//
// This one isn't exported to avoid having it become a brittle base
// class.
function PrettyPrintCtx(depth, buffer) {
  this.depth = depth || 0;
  this.buffer = buffer || [];
}

// Add a string to the buffer
PrettyPrintCtx.prototype.push = function (str) {
  this.buffer.push(str);
}

// Add (optional) string to the buffer, followed by a newline, followed
// by an appropriate amount of whitespace for the current depth.
PrettyPrintCtx.prototype.pushln = function (str) {
  if (str) this.push(str);
  this.push('\n');
  for (var i = 0; i < this.depth; i++) this.push('  ');
}

// Return a new context with depth incremented by 1, but the same buffer.
PrettyPrintCtx.prototype.inc = function () {
  return new this.constructor(this.depth + 1, this.buffer);
}

// Copy contents of buffer to a new string
PrettyPrintCtx.prototype.toString = function () {
  return this.buffer.join('');
}

semantics.addOperation('prettyPrint(ctx)', {
  Object_empty: function (_, _) {
    this.args.ctx.push('{}');
  },
  Object_nonEmpty: function (_, x, _, xs, _) {
    this.args.ctx.push('{');
    var newCtx = this.args.ctx.inc();
    newCtx.pushln();
    x.children[0].prettyPrint(newCtx);
    newCtx.push(': ');
    x.children[2].prettyPrint(newCtx);
    for (var i = 0; i < xs.children.length; i++) {
      newCtx.pushln(',');
      var c = xs.children[i];
      c.children[0].prettyPrint(newCtx);
      newCtx.push(': ');
      c.children[2].prettyPrint(newCtx);
    }
    this.args.ctx.pushln();
    this.args.ctx.pushln('}');
  },
  Array_empty: function (_, _) {
    this.args.ctx.push('[]');
  },
  Array_nonEmpty: function (_, x, _, xs, _) {
    this.args.ctx.push('[');
    var newCtx = this.args.ctx.inc();
    newCtx.pushln();
    x.prettyPrint(newCtx);
    for (var i = 0; i < xs.children.length; i++) {
      newCtx.pushln(',');
      xs.children[i].prettyPrint(newCtx);
    }
    this.args.ctx.pushln();
    this.args.ctx.push(']');
  },
  // TODO should a pretty printer handle unescaping?
  String: function (e) { this.args.ctx.push(e.interval.contents); },
  Number: function (e) { this.args.ctx.push(e.interval.contents); },
  True: function (e) { this.args.ctx.push('true'); },
  False: function (e) { this.args.ctx.push('false'); },
  Null: function (e) { this.args.ctx.push('null'); }
});

// Takes a string of valid json, and returns a pretty printed string
// representing the same json value.
function prettyPrint(str) {
  var match = json.grammar.match(str);
  if (match.failed()) throw new Error(match.message);
  var ctx = new PrettyPrintCtx();
  semantics(match).prettyPrint(ctx);
  return ctx.toString();
}

module.exports = {
  semantics: semantics,
  prettyPrint: prettyPrint
}
