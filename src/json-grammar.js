var fs = require('fs');
var path = require('path');
var ohm = require('ohm-js');

var grammarPath = path.resolve(__dirname, 'json.ohm');
var grammarSrc = fs.readFileSync(grammarPath, {encoding: 'utf-8'});
module.exports = ohm.grammar(grammarSrc);
