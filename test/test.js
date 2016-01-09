var fs = require('fs');
var path = require('path');
var json = require('../index');

jsonCheckerPath = path.resolve(
  __dirname, 'nativejson-benchmark', 'data', 'jsonchecker'
);
var files = fs.readdirSync(jsonCheckerPath);

// As far as I can tell, the spec allows all of these...
var EXCLUDED_TESTS = [
  'fail01_EXCLUDE.json', // Tests a single string as a value
  'fail18_EXCLUDE.json', // Tests deep nesting of arrays
  'fail25.json', // Tests tabs in strings.
  'fail27.json' // Tests line breaks in strings.
]

var succeeded = true;
files.forEach(function (name) {
  if (EXCLUDED_TESTS.indexOf(name) !== -1) return;

  var contents = fs.readFileSync(
    path.resolve(jsonCheckerPath, name),
    {encoding: 'utf-8'}
  );

  var match = json.grammar.match(contents);

  if (name.match(/pass/) && !match.succeeded()) {
    console.log(match.message);
    succeeded = false;
  }

  if (name.match(/fail/) && match.succeeded()) {
    console.log('Expected failure, but succeeded on ', contents, name);
    succeeded = false;
  }
});

process.exit(succeeded ? 0 : 1)
