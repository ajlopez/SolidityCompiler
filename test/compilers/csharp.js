
var parsers = require('../../lib/parsers');
var compilers = require('../../lib/compilers/csharp');

function compileExpression(code) {
    var parser = parsers.parser(code);
    var compiler = compilers.compiler();
    
    var expr = parser.parseExpression();
    
    return expr.compile(compiler);
}

function compileCommand(code) {
    var parser = parsers.parser(code);
    var compiler = compilers.compiler();
    
    var expr = parser.parseCommand();
    
    return expr.compile(compiler);
}

exports['compile simple integer'] = function (test) {
    var result = compileExpression('42');
    
    test.ok(result);
    test.equal(result, 42);
};

exports['compile simple string'] = function (test) {
    var result = compileExpression('"foo"');
    
    test.ok(result);
    test.equal(result, '"foo"');
};

exports['compile simple name'] = function (test) {
    var result = compileExpression('foo');
    
    test.ok(result);
    test.equal(result, 'foo');
};

exports['compile simple assignment to variable'] = function (test) {
    var result = compileExpression('answer = 42');
    
    test.ok(result);
    test.equal(result, 'answer.Set(42)');
};

exports['compile false constant'] = function (test) {
    var result = compileExpression('false');
    
    test.ok(result);
    test.equal(result, 'false');
};

exports['compile true constant'] = function (test) {
    var result = compileExpression('true');
    
    test.ok(result);
    test.equal(result, 'true');
};

exports['compile call with two arguments'] = function (test) {
    var result = compileExpression('fn(1,2)');
    
    test.ok(result);
    test.equal(result, 'fn(1, 2)');
};

exports['compile call with one argument'] = function (test) {
    var result = compileExpression('fn(x)');
    
    test.ok(result);
    test.equal(result, 'fn(x)');
};

exports['compile call with no arguments'] = function (test) {
    var result = compileExpression('fn()');
        
    test.ok(result);
    test.equal(result, 'fn()');
};

exports['compile add variable to integer'] = function (test) {
    var result = compileExpression('a + 1');
        
    test.ok(result);
    test.equal(result, 'a.Add(1)');
};

exports['compile add integer to variable'] = function (test) {
    var result = compileExpression('1 + a');
    
    test.ok(result);
    test.equal(result, 'a.Add(1)');
};

exports['compile add integer to integer'] = function (test) {
    var result = compileExpression('1 + 2');
    
    test.ok(result);
    test.equal(result, '1 + 2');
};

exports['compile subtract variable and integer'] = function (test) {
    var result = compileExpression('a - 1');
    
    test.ok(result);
    test.equal(result, 'a.Subtract(1)');
};

exports['compile subtract integer and variable'] = function (test) {
    var result = compileExpression('1 - a');
    
    test.ok(result);
    test.equal(result, 'a.SubtractFrom(1)');
};

exports['compile subtract integer and integer'] = function (test) {
    var result = compileExpression('1 - 2');
    
    test.ok(result);
    test.equal(result, '1 - 2');
};

exports['compile multiply variable and integer'] = function (test) {
    var result = compileExpression('a * 2');
    
    test.ok(result);
    test.equal(result, 'a.Multiply(2)');
};

exports['compile multiply integer and variable'] = function (test) {
    var result = compileExpression('2 * a');
    
    test.ok(result);
    test.equal(result, 'a.Multiply(2)');
};

exports['compile multiply integer and integer'] = function (test) {
    var result = compileExpression('21 * 2');
    
    test.ok(result);
    test.equal(result, '21 * 2');
};

exports['compile return command without return value'] = function (test) {
    var result = compileCommand('return;');
    
    test.ok(result);
    test.equal(result, 'return;');
}

exports['compile return command with return value'] = function (test) {
    var result = compileCommand('return 42;');
    
    test.ok(result);
    test.equal(result, 'return 42;');
}

exports['compile composite command'] = function (test) {
    var result = compileCommand('{ answer = 42; return 42; }');
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.deepEqual(result, [ 'answer.Set(42);', 'return 42;' ]);
}

exports['compile int variable command'] = function (test) {
    var result = compileCommand('int a;');

    test.ok(result);
    test.equal(result, 'Int256 a = new Int256();');
}

exports['compile int variable command with initial value'] = function (test) {
    var result = compileCommand('int a = 42;');

    test.ok(result);
    test.equal(result, 'Int256 a = new Int256(42);');
}

exports['compile uint variable command'] = function (test) {
    var result = compileCommand('uint a;');

    test.ok(result);
    test.equal(result, 'UInt256 a = new UInt256();');
}

exports['compile uint variable command with initial value'] = function (test) {
    var result = compileCommand('uint a = 42;');

    test.ok(result);
    test.equal(result, 'UInt256 a = new UInt256(42);');
}

exports['compile string variable command'] = function (test) {
    var result = compileCommand('string a;');

    test.ok(result);
    test.equal(result, 'string a;');
}

exports['compile string variable command with initial value'] = function (test) {
    var result = compileCommand('string a = "foo";');

    test.ok(result);
    test.equal(result, 'string a = "foo";');
}

exports['compile function with two arguments, no return type and empty body'] = function (test) {
    var result = compileCommand('function fn(int a, int b) {}');

    test.ok(result);
    test.ok(Array.isArray(result));
    test.deepEqual(result, [ 'public void fn(Int256 a, Int256 b) {', '}' ]);
}

exports['compile function with two arguments, int type and non-empty body'] = function (test) {
    var result = compileCommand('function fn(int a, int b) returns (int) { return a+b; }');

    test.ok(result);
    test.ok(Array.isArray(result));
    test.deepEqual(result, [ 'public Int256 fn(Int256 a, Int256 b) {', '    return a.Add(b);', '}' ]);
}

exports['compile empty contract'] = function (test) {
    var result = compileCommand('contract Empty { }');
    
    test.ok(result);
    test.ok(Array.isArray(result));

    test.deepEqual(result, [ 'public class Empty : Contract {', '}' ]);
}

exports['compile contract with two variables'] = function (test) {
    var result = compileCommand('contract Simple { int a; int b; }');
    
    test.ok(result);
    test.ok(Array.isArray(result));

    test.deepEqual(result, [ 
        'public class Simple : Contract {',
        '    Int256 a = new Int256();',
        '',
        '    Int256 b = new Int256();',
        '}'
    ]);
}
