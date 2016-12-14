
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

var types = [ 'string', 'bytes', 'int', 'uint', 'bool', 'address', 'fixed', 'ufixed' ];

for (var k = 1; k <= 32; k++) {
	types.push('int' + (k*8));
	types.push('uint' + (k*8));	
}

function TypeDescription(type, lens) {
	this.name = function () { return type; };
	
	if (lens) {
		this.length = function (pos) { return lens[pos]; }; 

		this.dimensions = function () { return lens.length; };
	}
}

function VarCommand(type, name, expr) {
	this.cmdtype = function () { return "VarCommand"; };
	
	this.type = function () { return type; };
	
	this.name = function () { return name; };

	this.expression = function () { return expr; };
}

function ContractCommand(name, body) {
	this.cmdtype = function () { return "ContractCommand"; };
	
    this.name = function () { return name; };
    
    this.body = function () { return body; };
}

function FunctionCommand(name, returns, body) {
	this.cmdtype = function () { return "FunctionCommand"; };
	
    this.name = function () { return name; };
    
    this.body = function () { return body; };
	
	this.returns = function () { return returns; };
}

function IfCommand(cond, thencmd, elsecmd) {
	this.cmdtype = function () { return "IfCommand"; };
	
	this.condition = function () { return cond; };
	
	this.thencmd = function () { return thencmd; };
	
	this.elsecmd = function () { return elsecmd; };
}

function WhileCommand(cond, cmd) {
	this.cmdtype = function () { return "WhileCommand"; };
	
	this.condition = function () { return cond; };
	
	this.command = function () { return cmd; };
}

function ForCommand(precmd, cond, postcmd, cmd) {
	this.cmdtype = function () { return "ForCommand"; };
	
	this.precmd = function () { return precmd; };
	
	this.condition = function () { return cond; };
	
	this.postcmd = function () { return postcmd; };
	
	this.command = function () { return cmd; };
}

function CompositeCommand(cmds) {
	this.cmdtype = function () { return "CompositeCommand"; };

	this.commands = function () { return cmds; }
}

function ContinueCommand() {
    
}

function BreakCommand() {
    
}

function ExpressionCommand(expr) {
	this.cmdtype = function () { return "ExpressionCommand"; };

	this.expression = function () { return expr; }
}

function ReturnCommand(expr) {
	this.cmdtype = function () { return "ReturnCommand"; };

	this.expression = function () { return expr; }
}

function AssignmentExpression(lvalue, expr) {
	this.lvalue = function () { return lvalue; }
	this.expression = function () { return expr; }
}

function IntegerExpression(value) {
	this.exprtype = function () { return "IntegerExpression"; };

	this.value = function() { return value; }
}

function StringExpression(value) {
	this.exprtype = function () { return "StringExpression"; };

	this.value = function() { return value; }
}

function BooleanExpression(value) {
	this.exprtype = function () { return "BooleanExpression"; };

	this.value = function() { return value; }
}

function NameExpression(name) {
	this.exprtype = function () { return "NameExpression"; };

	this.name = function () { return name; }
    
	this.lvalue = true;
}

function BinaryExpression(oper, left, right) {
	this.exprtype = function () { return "BinaryExpression"; };

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
	
	this.parseCommand = function() {
		return parseCommand();
	}
	
	function parseCommand() {
		if (tryParseToken(TokenType.Name, 'return')) {
			var cmd = new ReturnCommand(parseExpression());
			tryParseToken(TokenType.Punctuation, ';');
			return cmd;
		}
		
		if (tryParseToken(TokenType.Name, 'continue')) {
			var cmd = new ContinueCommand();
			tryParseToken(TokenType.Punctuation, ';');
			return cmd;
		}
		
		if (tryParseToken(TokenType.Name, 'contract')) {
			var name = parseName();
            var body = parseCommand();
            
            return new ContractCommand(name, body);
		}

		if (tryParseToken(TokenType.Name, 'function')) {
			var name = parseName();
			var returns = null;
			parseToken(TokenType.Punctuation, '(');
			parseToken(TokenType.Punctuation, ')');
			
			if (tryParseToken(TokenType.Name, 'returns')) {
				parseToken(TokenType.Punctuation, '(');
				returns = tryParseType();
				parseToken(TokenType.Punctuation, ')');
			}
			
            var body = parseCommand();
            
            return new FunctionCommand(name, returns, body);
		}
		
		var type = tryParseType();

		if (type) {
			var name = parseName();
            var expr;
            
            if (tryParseToken(TokenType.Operator, '='))
                var expr = parseExpression();
            
            var cmd = new VarCommand(type, name, expr);
			
			tryParseToken(TokenType.Punctuation, ';');
			
			return cmd;
		}

		if (tryParseToken(TokenType.Name, 'if')) {
			parseToken(TokenType.Punctuation, '(');
			var cond = parseExpression();
			parseToken(TokenType.Punctuation, ')');
			var thencmd = parseCommand();
			var elsecmd = null;
			
			if (tryParseToken(TokenType.Name, 'else'))
				elsecmd = parseCommand();
			
			return new IfCommand(cond, thencmd, elsecmd);
		}

		if (tryParseToken(TokenType.Name, 'while')) {
			parseToken(TokenType.Punctuation, '(');
			var cond = parseExpression();
			parseToken(TokenType.Punctuation, ')');
			var cmd = parseCommand();
			
			return new WhileCommand(cond, cmd);
		}

		if (tryParseToken(TokenType.Name, 'for')) {
			parseToken(TokenType.Punctuation, '(');
			var precmd = parseCommand();
			var cond = parseExpression();
			
			parseToken(TokenType.Punctuation, ';');
			
			var postcmd = parseCommand();
			parseToken(TokenType.Punctuation, ')');
			
			var cmd = parseCommand();
			
			return new ForCommand(precmd, cond, postcmd, cmd);
		}

		if (tryParseToken(TokenType.Name, 'break')) {
			var cmd = new BreakCommand();
			tryParseToken(TokenType.Punctuation, ';');
			return cmd;
		}

		if (tryParseToken(TokenType.Punctuation, '{'))
			return parseCommands();
		
		var expr = parseExpression();
		
		if (expr == null)
			return null;
		
		tryParseToken(TokenType.Punctuation, ';');
		
		return new ExpressionCommand(expr);
	}

	function parseCommands() {
		var cmds = [];
		
		while (!tryParseToken(TokenType.Punctuation, '}'))
			cmds.push(parseCommand());
		
		return new CompositeCommand(cmds);
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
	
	function tryParseType() {
		var token = lexer.nextToken();
		
		if (token != null && token.type == TokenType.Name && types.indexOf(token.value) >= 0) {
			if (tryParseToken(TokenType.Punctuation, '[')) {
				parseToken(TokenType.Punctuation, ']');
				if (tryParseToken(TokenType.Punctuation, '[')) {
					parseToken(TokenType.Punctuation, ']');
					return new TypeDescription(token.value + '[][]', [ -1, -1 ]);
				}
				return new TypeDescription(token.value + '[]', [ -1 ]);
			}
			
			return new TypeDescription(token.value);			
		}
		
		lexer.pushToken(token);
		
		return null;
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

