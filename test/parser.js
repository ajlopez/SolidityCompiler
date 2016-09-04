
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

exports['parse name'] = function (test) {
	var parser = parsers.parser('foo');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.name(), "foo");
};



