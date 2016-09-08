
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

function IntegerExpression(value) {
	this.value = function() { return value; }
}

function StringExpression(value) {
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
		var expr = parseTerm();
		
		if (expr == null)
			return null;
		
		var token = lexer.nextToken();
		
		if (token == null)
			return expr;
		
		if (token.type == TokenType.Operator && token.value == '+')
			return new BinaryExpression('+', expr, this.parseExpression());
		
		if (token.type == TokenType.Operator && token.value == '-')
			return new BinaryExpression('-', expr, this.parseExpression());

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
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
}

