
var parsers = require('../../lib/parsers');
var compilers = require('../../lib/compilers/csharp');

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
    test.equal(result, 'answer.Set(42)');
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
    test.equal(result, 'a.Add(1)');
};

exports['compile add integer to variable'] = function (test) {
    var parser = parsers.parser('1 + a');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'a.Add(1)');
};

exports['compile add integer to integer'] = function (test) {
    var parser = parsers.parser('1 + 2');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, '1 + 2');
};

exports['compile subtract variable and integer'] = function (test) {
    var parser = parsers.parser('a - 1');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'a.Subtract(1)');
};

exports['compile subtract integer and variable'] = function (test) {
    var parser = parsers.parser('1 - a');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'a.SubtractFrom(1)');
};

exports['compile subtract integer and integer'] = function (test) {
    var parser = parsers.parser('1 - 2');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, '1 - 2');
};

exports['compile multiply variable and integer'] = function (test) {
    var parser = parsers.parser('a * 2');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'a.Multiply(2)');
};

exports['compile multiply integer and variable'] = function (test) {
    var parser = parsers.parser('2 * a');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'a.Multiply(2)');
};

exports['compile multiply integer and integer'] = function (test) {
    var parser = parsers.parser('21 * 2');
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    var result = expr.compile(compiler);
    
    test.ok(result);
    test.equal(result, '21 * 2');
};

exports['compile return command without return value'] = function (test) {
    var parser = parsers.parser('return;');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'return;');
}

exports['compile return command with return value'] = function (test) {
    var parser = parsers.parser('return 42;');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);
    
    test.ok(result);
    test.equal(result, 'return 42;');
}

exports['compile composite command'] = function (test) {
    var parser = parsers.parser('{ answer = 42; return 42; }');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.deepEqual(result, [ 'answer.Set(42);', 'return 42;' ]);
}

exports['compile int variable command'] = function (test) {
    var parser = parsers.parser('int a;');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);

    test.ok(result);
    test.equal(result, 'Int256 a = new Int256();');
}

exports['compile int variable command with initial value'] = function (test) {
    var parser = parsers.parser('int a = 42;');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);

    test.ok(result);
    test.equal(result, 'Int256 a = new Int256(42);');
}

exports['compile uint variable command'] = function (test) {
    var parser = parsers.parser('uint a;');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);

    test.ok(result);
    test.equal(result, 'UInt256 a = new UInt256();');
}

exports['compile uint variable command with initial value'] = function (test) {
    var parser = parsers.parser('uint a = 42;');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);

    test.ok(result);
    test.equal(result, 'UInt256 a = new UInt256(42);');
}


exports['compile string variable command'] = function (test) {
    var parser = parsers.parser('string a;');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);

    test.ok(result);
    test.equal(result, 'string a;');
}

exports['compile string variable command with initial value'] = function (test) {
    var parser = parsers.parser('string a = "foo";');
    var compiler = compilers.compiler();
    
    var cmd = parser.parseCommand();
    
    var result = cmd.compile(compiler);

    test.ok(result);
    test.equal(result, 'string a = "foo";');
}

