
var lexers = require('../lib/lexers');
var TokenType = lexers.TokenType;

exports['create lexer'] = function (test) {
    var lexer = lexers.lexer();
    
    test.ok(lexer);
    test.equal(typeof lexer, 'object');
};

exports['get name token'] = function (test) {
	var lexer = lexers.lexer('foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name token without spaces'] = function (test) {
	var lexer = lexers.lexer('   foo    ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name token without whitespaces'] = function (test) {
	var lexer = lexers.lexer('  \r\t\nfoo \r\t\n   ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get two name tokens'] = function (test) {
	var lexer = lexers.lexer('foo bar');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, 'bar');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get integer token'] = function (test) {
	var lexer = lexers.lexer('42');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['get semicolon as punctuation'] = function (test) {
	var lexer = lexers.lexer(';');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, ';');
	test.equal(token.type, TokenType.Punctuation);
	
	test.equal(lexer.nextToken(), null);
}

exports['get comma as punctuation'] = function (test) {
	var lexer = lexers.lexer(',');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, ',');
	test.equal(token.type, TokenType.Punctuation);
	
	test.equal(lexer.nextToken(), null);
}

exports['get curly braces as punctuation'] = function (test) {
	var lexer = lexers.lexer('{}');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '{');
	test.equal(token.type, TokenType.Punctuation);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '}');
	test.equal(token.type, TokenType.Punctuation);
	
	test.equal(lexer.nextToken(), null);
}

exports['get less than as operator'] = function (test) {
	var lexer = lexers.lexer('<');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '<');
	test.equal(token.type, TokenType.Operator);
	
	test.equal(lexer.nextToken(), null);
}

exports['get greater than as operator'] = function (test) {
	var lexer = lexers.lexer('>');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.value, '>');
	test.equal(token.type, TokenType.Operator);
	
	test.equal(lexer.nextToken(), null);
}

exports['get arithmetic operators'] = function (test) {
	var lexer = lexers.lexer('+ - * / % **');
	
	[ '+', '-', '*', '/', '%', '**' ].forEach(function (op) {
		var token = lexer.nextToken();
		
		test.ok(token);
		test.equal(token.value, op);
		test.equal(token.type, TokenType.Operator);
	});
	
	test.equal(lexer.nextToken(), null);
}


exports['get comparison operators'] = function (test) {
	var lexer = lexers.lexer('< > <= >= == !=');
	
	[ '<', '>', '<=', '>=', '==', '!=' ].forEach(function (op) {
		var token = lexer.nextToken();
		
		test.ok(token);
		test.equal(token.value, op);
		test.equal(token.type, TokenType.Operator);
	});
	
	test.equal(lexer.nextToken(), null);
}
