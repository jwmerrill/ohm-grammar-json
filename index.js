var grammar = require('./src/json-grammar');
var parser = require('./src/parser');

module.exports = {
  grammar: grammar,
  semantics: parser.semantics,
  parse: parser.parse
};
