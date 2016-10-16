
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
	test.equal(expr.value(), 42);
};

exports['parse string'] = function (test) {
	var parser = parsers.parser('"foo"');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.value(), "foo");
};

exports['parse true'] = function (test) {
	var parser = parsers.parser('true');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.value(), true);
};

exports['parse false'] = function (test) {
	var parser = parsers.parser('false');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.value(), false);
};

exports['parse name'] = function (test) {
	var parser = parsers.parser('foo');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.name(), "foo");
};

exports['parse add integers'] = function (test) {
	var parser = parsers.parser('1+2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
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
	test.equal(expr.operator(), '+');
	test.equal(expr.expression().value(), 42);
};

exports['parse unary minus integer'] = function (test) {
	var parser = parsers.parser('-42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '-');
	test.equal(expr.expression().value(), 42);
};

exports['parse logical not boolean'] = function (test) {
	var parser = parsers.parser('!false');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '!');
	test.equal(expr.expression().value(), false);
};

exports['parse post increment integer'] = function (test) {
	var parser = parsers.parser('2++');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.operator(), '++');
	test.equal(expr.expression().value(), 2);
};

exports['parse post decrement integer'] = function (test) {
	var parser = parsers.parser('3--');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
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
	test.equal(expr.expression().name(), 'foo');
	test.equal(expr.name(), 'bar');
};

exports['parse call with arguments'] = function (test) {
	var parser = parsers.parser('foo(1, 42)');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
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
	test.ok(expr.lvalue());
	test.equal(expr.lvalue().name(), 'foo');
	test.ok(expr.expression());
	test.equal(expr.expression().value(), 42);
};

