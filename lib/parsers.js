
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

var leftunioperators = [ '++', '--', '~', '!', '+', '-' ];

var rigthunioperators = [ '++', '--' ];

function AssignmentExpression(lvalue, expr) {
	this.lvalue = function () { return lvalue; }
	this.expression = function () { return expr; }
}

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
	this.lvalue = true;
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
	var lexer = lexers.lexer(text);
	
	this.parseExpression = function() {
		return parseExpression();
	}
	
	function parseExpression() {
		var expr = parseBinaryExpression(0);
		
		if (expr && expr.lvalue && tryParseToken(TokenType.Operator, '='))
			return new AssignmentExpression(expr, parseExpression());
		
		return expr;
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
			var token = lexer.nextToken();
			
			if (!token)
				return expr;
			
			if (token.type == TokenType.Operator && rigthunioperators.indexOf(token.value) >= 0) {
				expr = new PostUnaryExpression(expr, token.value);
				continue;
			}

			if (token.type == TokenType.Punctuation && token.value == '.') {
				expr = new DotExpression(expr, parseName());
				continue;
			}

			if (token.type == TokenType.Punctuation && token.value == '(') {
				expr = new CallExpression(expr, parseArguments());
				continue;
			}
			
			lexer.pushToken(token);
						
			return expr;
		}
	}
	
	function parseArguments() {
		var args = [];
		
		while (!tryParseToken(TokenType.Punctuation, ')')) {
			if (args.length)
				parseToken(TokenType.Punctuation, ',');
			
			args.push(parseExpression());
		}
		
		return args;
	}
	
	function parseSimpleTerm() {
		var token = lexer.nextToken();
		
		if (!token)
			return null;
		
		if (token.type == TokenType.Operator && leftunioperators.indexOf(token.value) >= 0)
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

