var fs = require('fs');
var path = require('path');
var deepEqual = require('deep-equal');

var json = require('../index');
var prettyPrint = require('../examples/pretty-printer').prettyPrint;

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
];

var succeeded = true;
files.forEach(function (name) {
  if (EXCLUDED_TESTS.indexOf(name) !== -1) return;

  var contents = fs.readFileSync(
    path.resolve(jsonCheckerPath, name),
    {encoding: 'utf-8'}
  );

  var match = json.grammar.match(contents);

  if (name.match(/pass/)) {
    if (!match.succeeded()) {
      console.log(match.message);
      succeeded = false;
    }

    if (!deepEqual(json.parse(contents), JSON.parse(contents))) {
      console.log(
        'Parse results did not match native implementation.',
        contents
      );
      succeeded = false;
    }

    if (!deepEqual(json.parse(contents), json.parse(prettyPrint(contents)))) {
      console.log(
        'Parsing pretty-printed results did not match original parse.',
        contents
      );
      succeeded = false;
    }
  }

  if (name.match(/fail/) && match.succeeded()) {
    console.log('Expected failure, but succeeded on ', contents, name);
    succeeded = false;
  }
});

process.exit(succeeded ? 0 : 1);
