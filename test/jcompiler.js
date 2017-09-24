
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

exports['compile simple assignment to variable'] = function (test) {
    var parser = parsers.parser('answer = 42');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'answer.set(42)');
};

exports['compile false constant'] = function (test) {
    var parser = parsers.parser('false');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'false');
};

exports['compile true constant'] = function (test) {
    var parser = parsers.parser('true');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'true');
};

