
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

var binoperators = [ 
	[ '==', '!=' ],
	[ '<', '>', '<=', '>=' ],
	[ '||', '&&' ],
	[ '<<', '>>' ],
	[ '+', '-' ],
	[ '**' ],
	[ '*', '/', '%' ],
	[ '&' ],
	[ '^' ],
	[ '|' ]
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

function UnaryExpression(oper, expr) {
	this.operator = function () { return oper; };
	
	this.expression = function () { return expr; };
}

function PostUnaryExpression(expr, oper) {
	this.operator = function () { return oper; };
	
	this.expression = function () { return expr; };
}

function DotExpression(expr, name) {
	this.expression = function () { return expr; };

	this.name = function () { return name; };
}

function CallExpression(expr, args) {
	this.expression = function () { return expr; };

	this.arguments = function () { return args; };
}

function Parser(text) {
	var self = this;
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
		var expr = parseSimpleTerm();
		
		if (expr == null)
			return expr;
		
		while (true) {
			if (tryParseToken(TokenType.Operator, '++')) {
				expr = new PostUnaryExpression(expr, '++');
				continue;
			}

			if (tryParseToken(TokenType.Operator, '--')) {
				expr = new PostUnaryExpression(expr, '--');
				continue;
			}

			if (tryParseToken(TokenType.Punctuation, '.')) {
				expr = new DotExpression(expr, parseName());
				continue;
			}

			if (tryParseToken(TokenType.Punctuation, '(')) {
				expr = new CallExpression(expr, parseArguments());
				continue;
			}
			
			break;
		}
		
		return expr;
	}
	
	function parseArguments() {
		var args = [];
		
		while (!tryParseToken(TokenType.Punctuation, ')')) {
			if (args.length)
				parseToken(TokenType.Punctuation, ',');
			
			args.push(self.parseExpression());
		}
		
		return args;
	}
	
	function parseSimpleTerm() {
		var token = lexer.nextToken();
		
		if (!token)
			return null;
		
		if (token.type == TokenType.Operator && (token.value == '++' || token.value == '--'))
			return new UnaryExpression(token.value, parseSimpleTerm());
		
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
		
		if (token.type == TokenType.Operator && token.value == "~")
			return new UnaryExpression('~', parseTerm());

		if (token.type == TokenType.Operator && token.value == "!")
			return new UnaryExpression('!', parseTerm());

		if (token.type == TokenType.Operator && token.value == "+")
			return new UnaryExpression('+', parseTerm());

		if (token.type == TokenType.Operator && token.value == "-")
			return new UnaryExpression('-', parseTerm());
	}
	
	function tryParseToken(type, value) {
		var token = lexer.nextToken();
		
		if (token != null && token.type == type && token.value == value)
			return true;
		
		lexer.pushToken(token);
		
		return false;
	}
	
	function parseToken(type, value) {
		var token = lexer.nextToken();
		
		if (token == null || token.type != type || token.value != value)
			throw new Error("Expected '" + value + "'");
		
		return false;
	}
	
	function parseName() {
		var token = lexer.nextToken();
		
		if (token == null || token.type != TokenType.Name)
			throw new Error("Expected name");
		
		return token.value;
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
}

