
var parsers = require('../lib/parsers');
var compilers = require('../lib/compilers/java');

exports['compile simple integer'] = function (test) {
    var parser = parsers.parser('42');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 42);
};

exports['compile simple string'] = function (test) {
    var parser = parsers.parser('"foo"');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, '"foo"');
};

exports['compile simple name'] = function (test) {
    var parser = parsers.parser('foo');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'foo');
};

