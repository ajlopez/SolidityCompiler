
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

exports['compile call with two arguments'] = function (test) {
    var parser = parsers.parser('fn(1,2)');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'fn(1, 2)');
};

exports['compile call with one argument'] = function (test) {
    var parser = parsers.parser('fn(x)');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'fn(x)');
};

exports['compile call with no arguments'] = function (test) {
    var parser = parsers.parser('fn()');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'fn()');
};

exports['compile add variable to integer'] = function (test) {
    var parser = parsers.parser('a + 1');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'a.add(1)');
};

exports['compile add integer to variable'] = function (test) {
    var parser = parsers.parser('1 + a');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'a.add(1)');
};

exports['compile add integer to integer'] = function (test) {
    var parser = parsers.parser('1 + 2');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, '1 + 2');
};

