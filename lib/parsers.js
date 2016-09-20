
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

var binoperators = [ 
	[ '==', '!=' ],
	[ '||', '&&' ],
	[ '+', '-' ],
	[ '*', '/', '%' ],
	[ '**' ],
	[ '&', '|', '^' ]
];

function IntegerExpression(value) {
	this.value = function() { return value; }
}

function StringExpression(value) {
	this.value = function() { return value; }
}

function BooleanExpression(value) {
	this.value = function() { return value; }
}

function NameExpression(name) {
	this.name = function () { return name; }
}

function BinaryExpression(oper, left, right) {
	this.operator = function () { return oper; };
	
	this.left = function () { return left; };
	
	this.right = function () { return right; };
}

function Parser(text) {
	var lexer = lexers.lexer(text);
	
	this.parseExpression = function() {
		return parseBinaryExpression(0);
	}
	
	function parseBinaryExpression(level) {
		if (level >= binoperators.length)
			return parseTerm();
		
		var expr = parseBinaryExpression(level + 1);
		
		if (expr == null)
			return null;
		
		var token = lexer.nextToken();
		
		while (token && token.type == TokenType.Operator && binoperators[level].indexOf(token.value) >= 0) {
			expr = new BinaryExpression(token.value, expr, parseBinaryExpression(level + 1));
			token = lexer.nextToken();
		}
		
		if (token)
			lexer.pushToken(token);
		
		return expr;
	}
	
	function parseTerm() {
		var token = lexer.nextToken();
		
		if (!token)
			return null;
            
        if (token.type == TokenType.Integer)		
            return new IntegerExpression(parseInt(token.value));
            
        if (token.type == TokenType.String)
            return new StringExpression(token.value);

        if (token.type == TokenType.Name)
            return new NameExpression(token.value);

        if (token.type == TokenType.Boolean) {
			if (token.value == "true")
				return new BooleanExpression(true);
			if (token.value == "false")
				return new BooleanExpression(false);
		}
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
}

