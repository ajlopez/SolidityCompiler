
var fs = require('fs');
var solcomp = require('../..');

var filename = process.argv[2];
var language = process.argv[3];

var options = require('./' + language + '.json');

var code = fs.readFileSync(filename).toString();

var compiled = solcomp.compileCode(code, options);

console.log(compiled);


