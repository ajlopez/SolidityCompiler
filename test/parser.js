
var parsers = require('../lib/parsers');

exports['parse null expression from empty string'] = function (test) {
	var parser = parsers.parser('');
	
	var expr = parser.parseExpression();
	
	test.equal(expr, null);
};

exports['parse integer'] = function (test) {
	var parser = parsers.parser('42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'IntegerExpression');
	
	test.deepEqual(expr.toObject(), { type: 'IntegerExpression', value: 42 });
	
	test.equal(expr.value(), 42);
};

exports['parse string'] = function (test) {
	var parser = parsers.parser('"foo"');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'StringExpression');

	test.deepEqual(expr.toObject(), { type: 'StringExpression', value: 'foo' });

	test.equal(expr.value(), "foo");
};

exports['parse true'] = function (test) {
	var parser = parsers.parser('true');
	
	var expr = parser.parseExpression();
		
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'BooleanExpression');

	test.ok(expr);
	test.equal(expr.value(), true);

	test.deepEqual(expr.toObject(), { type: 'BooleanExpression', value: true });	
};

exports['parse false'] = function (test) {
	var parser = parsers.parser('false');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
		
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'BooleanExpression');
    
	test.equal(expr.value(), false);

	test.deepEqual(expr.toObject(), { type: 'BooleanExpression', value: false });
};

exports['parse name'] = function (test) {
	var parser = parsers.parser('foo');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
		
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'NameExpression');

	test.equal(expr.name(), "foo");

	test.deepEqual(expr.toObject(), { type: 'NameExpression', name: 'foo' });
};

exports['parse add integers'] = function (test) {
	var parser = parsers.parser('1+2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
		
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'BinaryExpression');

	test.equal(expr.operator(), '+');
	test.equal(expr.left().value(), 1);
	test.equal(expr.right().value(), 2);
};

exports['parse subtract integers'] = function (test) {
	var parser = parsers.parser('1-2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '-');
	test.equal(expr.left().value(), 1);
	test.equal(expr.right().value(), 2);
};

exports['parse multiply integers'] = function (test) {
	var parser = parsers.parser('2*3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '*');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse divide integers'] = function (test) {
	var parser = parsers.parser('2/3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '/');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse module integers'] = function (test) {
	var parser = parsers.parser('2 % 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '%');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse add and divide integers'] = function (test) {
	var parser = parsers.parser('1+2/3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '+');
	test.equal(expr.left().value(), 1);
	test.equal(expr.right().operator(), '/');
	test.equal(expr.right().left().value(), 2);
	test.equal(expr.right().right().value(), 3);
};

exports['parse multiply and add integers'] = function (test) {
	var parser = parsers.parser('2*3+1');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '+');
	test.equal(expr.right().value(), 1);
	test.equal(expr.left().operator(), '*');
	test.equal(expr.left().left().value(), 2);
	test.equal(expr.left().right().value(), 3);
};

exports['parse or booleans'] = function (test) {
	var parser = parsers.parser('true||false');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '||');
	test.equal(expr.left().value(), true);
	test.equal(expr.right().value(), false);
};

exports['parse and booleans'] = function (test) {
	var parser = parsers.parser('true && false');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '&&');
	test.equal(expr.left().value(), true);
	test.equal(expr.right().value(), false);
};

exports['parse equal integers'] = function (test) {
	var parser = parsers.parser('1 == 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '==');
	test.equal(expr.left().value(), 1);
	test.equal(expr.right().value(), 2);
};

exports['parse not equal integers'] = function (test) {
	var parser = parsers.parser('1 != 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '!=');
	test.equal(expr.left().value(), 1);
	test.equal(expr.right().value(), 2);
};

exports['parse exponentiation integers'] = function (test) {
	var parser = parsers.parser('2 ** 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '**');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse bitwise not integer'] = function (test) {
	var parser = parsers.parser('~3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '~');
	test.equal(expr.expression().value(), 3);
};

exports['parse unary plus integer'] = function (test) {
	var parser = parsers.parser('+42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
		
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'UnaryExpression');

	test.equal(expr.operator(), '+');
	test.equal(expr.expression().value(), 42);

	test.deepEqual(expr.toObject(), { type: 'UnaryExpression', operator: '+', expression: { type: 'IntegerExpression', value: 42 } });
};

exports['parse unary minus integer'] = function (test) {
	var parser = parsers.parser('-42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '-');
	test.equal(expr.expression().value(), 42);

	test.deepEqual(expr.toObject(), { type: 'UnaryExpression', operator: '-', expression: { type: 'IntegerExpression', value: 42 } });
};

exports['parse logical not boolean'] = function (test) {
	var parser = parsers.parser('!false');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '!');
	test.equal(expr.expression().value(), false);

	test.deepEqual(expr.toObject(), { type: 'UnaryExpression', operator: '!', expression: { type: 'BooleanExpression', value: false } });
};

exports['parse post increment integer'] = function (test) {
	var parser = parsers.parser('2++');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), "PostUnaryExpression");
	
	test.equal(expr.operator(), '++');
	test.equal(expr.expression().value(), 2);
};

exports['parse post decrement integer'] = function (test) {
	var parser = parsers.parser('3--');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), "PostUnaryExpression");

	test.equal(expr.operator(), '--');
	test.equal(expr.expression().value(), 3);
};

exports['parse pre increment integer'] = function (test) {
	var parser = parsers.parser('++2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '++');
	test.equal(expr.expression().value(), 2);
};

exports['parse pre decrement integer'] = function (test) {
	var parser = parsers.parser('--3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '--');
	test.equal(expr.expression().value(), 3);
};

exports['parse bitwise and integers'] = function (test) {
	var parser = parsers.parser('2 & 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '&');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse bitwise or integers'] = function (test) {
	var parser = parsers.parser('2 | 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '|');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse bitwise xor integers'] = function (test) {
	var parser = parsers.parser('2 ^ 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '^');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse less integers'] = function (test) {
	var parser = parsers.parser('2 < 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '<');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse greater integers'] = function (test) {
	var parser = parsers.parser('2 > 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '>');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse less equal integers'] = function (test) {
	var parser = parsers.parser('2 <= 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '<=');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse greater equal integers'] = function (test) {
	var parser = parsers.parser('2 >= 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '>=');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse equal integers'] = function (test) {
	var parser = parsers.parser('2 == 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '==');
	test.equal(expr.left().value(), 2);
	test.equal(expr.right().value(), 3);
};

exports['parse bitwise left shift integers'] = function (test) {
	var parser = parsers.parser('3 << 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '<<');
	test.equal(expr.left().value(), 3);
	test.equal(expr.right().value(), 2);
};

exports['parse bitwise right shift integers'] = function (test) {
	var parser = parsers.parser('3 >> 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '>>');
	test.equal(expr.left().value(), 3);
	test.equal(expr.right().value(), 2);
};

exports['parse member access'] = function (test) {
	var parser = parsers.parser('foo.bar');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'DotExpression');
	
	test.equal(expr.expression().name(), 'foo');
	test.equal(expr.name(), 'bar');
};

exports['parse call with arguments'] = function (test) {
	var parser = parsers.parser('foo(1, 42)');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), 'CallExpression');

	test.ok(expr.expression());
	test.equal(expr.expression().name(), 'foo');
	test.ok(expr.arguments());
	test.ok(Array.isArray(expr.arguments()));
	test.equal(expr.arguments().length, 2);
	test.equal(expr.arguments()[0].value(), 1);
	test.equal(expr.arguments()[1].value(), 42);
};

exports['parse member access with arguments'] = function (test) {
	var parser = parsers.parser('foo.bar(1, 42)');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.ok(expr.expression());
	test.equal(expr.expression().expression().name(), 'foo');
	test.equal(expr.expression().name(), 'bar');
	test.ok(expr.arguments());
	test.ok(Array.isArray(expr.arguments()));
	test.equal(expr.arguments().length, 2);
	test.equal(expr.arguments()[0].value(), 1);
	test.equal(expr.arguments()[1].value(), 42);
};

exports['parse assignment expression'] = function (test) {
	var parser = parsers.parser('foo = 42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	
	test.ok(expr.exprtype);
	test.equal(expr.exprtype(), "AssignmentExpression");
	
	test.ok(expr.lvalue());
	test.equal(expr.lvalue().name(), 'foo');
	
	test.ok(expr.expression());
	test.equal(expr.expression().value(), 42);
	
	test.deepEqual(expr.toObject(), { type: 'AssignmentExpression', lvalue: { type: 'NameExpression', name: 'foo' }, expression: { type: 'IntegerExpression', value: 42 } });
};

exports['parse assignment command'] = function (test) {
	var parser = parsers.parser('foo = 42;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.ok(cmd.expression());
	test.ok(cmd.expression().lvalue());
	test.equal(cmd.expression().lvalue().name(), 'foo');
	
	test.ok(cmd.expression().expression());
	test.equal(cmd.expression().expression().value(), 42);
	
	test.equal(parser.parseCommand(), null);
};

exports['parse expression command'] = function (test) {
	var parser = parsers.parser('42;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	
	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'ExpressionCommand');
	
	test.ok(cmd.expression());
	test.equal(cmd.expression().value(), 42);
	
	test.deepEqual(cmd.toObject(), { type: 'ExpressionCommand', expression: { type: 'IntegerExpression', value: 42 } });
	
	test.equal(parser.parseCommand(), null);
};

exports['parse return command'] = function (test) {
	var parser = parsers.parser('return 42;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	
	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'ReturnCommand');

	test.ok(cmd.expression());
	test.equal(cmd.expression().value(), 42);

	test.deepEqual(cmd.toObject(), { type: 'ReturnCommand', expression: { type: 'IntegerExpression', value: 42 } });
	
	test.equal(parser.parseCommand(), null);
};

exports['parse continue command'] = function (test) {
	var parser = parsers.parser('continue;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	
	test.ok(cmd.cmdtype);
	test.equal(cmd.cmdtype(), 'ContinueCommand');
	
	test.equal(cmd.name, null);
	test.equal(cmd.expression, null);
	
	test.deepEqual(cmd.toObject(), { type: 'ContinueCommand' });
	
	test.equal(parser.parseCommand(), null);
};

exports['parse break command'] = function (test) {
	var parser = parsers.parser('break;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	
	test.ok(cmd.cmdtype);
	test.equal(cmd.cmdtype(), 'BreakCommand');
	
	test.equal(cmd.name, null);
	test.equal(cmd.expression, null);
	
	test.deepEqual(cmd.toObject(), { type: 'BreakCommand' });

	test.equal(parser.parseCommand(), null);
};

exports['parse return command without value'] = function (test) {
	var parser = parsers.parser('return;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.expression(), null);
	
	test.deepEqual(cmd.toObject(), { type: 'ReturnCommand' });

	test.equal(parser.parseCommand(), null);
};

exports['parse composite command'] = function (test) {
	var parser = parsers.parser('{ return; }');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	


	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'CompositeCommand');

	test.ok(cmd.commands());
	test.equal(cmd.commands().length, 1);
	test.ok(cmd.commands()[0]);
	test.equal(cmd.commands()[0].expression(), null);
	
	test.equal(parser.parseCommand(), null);
};

exports['parse if command'] = function (test) {
	var parser = parsers.parser('if (true) return;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	
	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'IfCommand');
	
	test.ok(cmd.condition());
	test.equal(cmd.condition().value(), true);
	
	test.ok(cmd.thencmd());
	test.equal(cmd.thencmd().expression(), null);
	
	test.equal(parser.parseCommand(), null);
};

exports['parse if command with else'] = function (test) {
	var parser = parsers.parser('if (true) return; else continue;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	
	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'IfCommand');

	test.ok(cmd.condition());
	test.equal(cmd.condition().value(), true);

	test.ok(cmd.thencmd());
	test.equal(cmd.thencmd().expression(), null);

	test.ok(cmd.elsecmd());
	test.equal(cmd.elsecmd().expression, null);
	
	test.equal(parser.parseCommand(), null);
};

exports['parse while command'] = function (test) {
	var parser = parsers.parser('while (a < 10) a++;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
		
	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'WhileCommand');
	
	test.ok(cmd.condition());
	test.equal(cmd.condition().operator(), '<');
	test.equal(cmd.condition().left().name(), 'a');
	test.equal(cmd.condition().right().value(), 10);
	
	test.ok(cmd.command());
	test.ok(cmd.command().expression());
	test.equal(cmd.command().expression().operator(), '++');
	test.equal(cmd.command().expression().expression().name(), 'a');
	
	test.equal(parser.parseCommand(), null);
};

exports['parse for command'] = function (test) {
	var parser = parsers.parser('for (x = 0; x < 10; x++) a++;');
	
	var cmd = parser.parseCommand();
	
	test.ok(cmd);	
		
	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'ForCommand');

	test.ok(cmd.precmd());
	test.ok(cmd.precmd().expression());
	test.ok(cmd.precmd().expression().lvalue());
	test.equal(cmd.precmd().expression().lvalue().name(), 'x');
	test.ok(cmd.precmd().expression().expression());
	test.equal(cmd.precmd().expression().expression().value(), 0);
	
	test.ok(cmd.condition());
	test.equal(cmd.condition().operator(), '<');
	test.equal(cmd.condition().left().name(), 'x');
	test.equal(cmd.condition().right().value(), 10);
	
	test.ok(cmd.postcmd());
	test.ok(cmd.postcmd().expression());
	test.equal(cmd.postcmd().expression().operator(), '++');
	test.equal(cmd.postcmd().expression().expression().name(), 'x');
	
	test.ok(cmd.command());
	test.ok(cmd.command().expression());
	test.equal(cmd.command().expression().operator(), '++');
	test.equal(cmd.command().expression().expression().name(), 'a');
	
	test.equal(parser.parseCommand(), null);
};

exports['parse empty contract'] = function (test) {
	var parser = parsers.parser('contract MyContract {}');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
		
	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'ContractCommand');

	test.equal(cmd.name(), 'MyContract');
	test.ok(cmd.body());
	test.ok(cmd.body().commands);
	test.equal(0, cmd.body().commands().length);
};

exports['parse empty function'] = function (test) {
	var parser = parsers.parser('function MyFunction() {}');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
		
	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'FunctionCommand');

	test.equal(cmd.name(), 'MyFunction');
	test.equal(cmd.returns(), null);
	test.ok(cmd.body());
	test.ok(cmd.body().commands);
	test.equal(cmd.body().commands().length, 0);
};

exports['parse function with command'] = function (test) {
	var parser = parsers.parser('function MyFunction() { int x; }');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'MyFunction');
	test.equal(cmd.returns(), null);
	test.ok(cmd.body());
	test.ok(cmd.body().commands);
	test.equal(cmd.body().commands().length, 1);
	test.equal(cmd.body().commands()[0].name(), 'x');
};

exports['parse empty function with returns type'] = function (test) {
	var parser = parsers.parser('function MyFunction() returns (int) {}');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'MyFunction');
	test.ok(cmd.returns());
	test.equal(cmd.returns().name(), 'int');
	test.ok(cmd.body());
	test.ok(cmd.body().commands);
	test.equal(0, cmd.body().commands().length);
};

exports['parse string variable'] = function (test) {
	var parser = parsers.parser('string name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'string');
};

exports['parse bytes variable'] = function (test) {
	var parser = parsers.parser('bytes name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'bytes');
};

exports['parse int variable'] = function (test) {
	var parser = parsers.parser('int name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'int');
};

exports['parse int variable with value'] = function (test) {
	var parser = parsers.parser('int name = 42;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'int');
    test.ok(cmd.expression());
    test.equal(cmd.expression().value(), 42);
};

exports['parse int variables with size'] = function (test) {
	for (var k = 1; k <= 32; k++) {
		var parser = parsers.parser('int' + (k*8) + ' name;');
		var cmd = parser.parseCommand();
		
		test.ok(cmd);
		test.equal(cmd.name(), 'name');
		test.equal(cmd.type().name(), 'int' + (k*8));
	}
};

exports['parse unsigned int variable'] = function (test) {
	var parser = parsers.parser('uint name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'uint');
};

exports['parse unsigned int variables with size'] = function (test) {
	for (var k = 1; k <= 32; k++) {
		var parser = parsers.parser('uint' + (k*8) + ' name;');
		var cmd = parser.parseCommand();
		
		test.ok(cmd);
		test.equal(cmd.name(), 'name');
		test.equal(cmd.type().name(), 'uint' + (k*8));
	}
};

exports['parse fixed variable'] = function (test) {
	var parser = parsers.parser('fixed name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'fixed');
};

exports['parse unsigned fixed variable'] = function (test) {
	var parser = parsers.parser('ufixed name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'ufixed');
};

exports['parse bool variable'] = function (test) {
	var parser = parsers.parser('bool name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'bool');
};

exports['parse address variable'] = function (test) {
	var parser = parsers.parser('address name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'address');
};

exports['parse int array variable'] = function (test) {
	var parser = parsers.parser('int[] name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().name(), 'int[]');
	test.equal(cmd.type().dimensions(), 1);
	test.equal(cmd.type().length(0), -1);
};

exports['parse int two dim array variable'] = function (test) {
	var parser = parsers.parser('int[][] name;');
	var cmd = parser.parseCommand();
	
	test.ok(cmd);

	test.ok(cmd.cmdtype());
	test.equal(cmd.cmdtype(), 'VarCommand');
	
	test.equal(cmd.name(), 'name');
	test.equal(cmd.type().dimensions(), 2);
	test.equal(cmd.type().name(), 'int[][]');
	test.equal(cmd.type().length(0), -1);
	test.equal(cmd.type().length(1), -1);
};
