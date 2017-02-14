
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

var types = [ 'string', 'bytes', 'byte', 'bytes1', 'int', 'uint', 'bool', 'address', 'fixed', 'ufixed' ];

for (var k = 1; k <= 32; k++) {
	types.push('int' + (k*8));
	types.push('uint' + (k*8));	
	types.push('bytes' + k);	
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

	this.toObject = function () {
		var obj = {
			type: this.cmdtype(),
			name: this.name(),
			vartype: this.type().name()
		};
		
		var expr = this.expression();
		
		if (expr != null)
			obj.expression = expr.toObject();
		
		return obj;
	};
}

function ContractCommand(name, body) {
	this.cmdtype = function () { return "ContractCommand"; };
	
    this.name = function () { return name; };
    
    this.body = function () { return body; };
	
	this.toObject = function () {
		return {
			type: this.cmdtype(),
			name: this.name(),
			body: this.body().toObject()
		};
	};
}

function LibraryCommand(name, body) {
	this.cmdtype = function () { return "LibraryCommand"; };
	
    this.name = function () { return name; };
    
    this.body = function () { return body; };
	
	this.toObject = function () {
		return {
			type: this.cmdtype(),
			name: this.name(),
			body: this.body().toObject()
		};
	};
}

function FunctionCommand(name, args, modifiers, returns, body) {
	modifiers = modifiers || {};
	
	if (modifiers.internal == null && modifiers.external == null)
		modifiers.internal = true;
	
	if (modifiers.external == null)
		modifiers.external = !modifiers.internal;
	
	this.cmdtype = function () { return "FunctionCommand"; };
	
    this.name = function () { return name; };
	
	this.arity = function () {
		if (!args)
			return 0;
		
		return args.length;
	}
    
    this.body = function () { return body; };
	
	this.returns = function () { return returns; };

	this.modifiers = function () { return modifiers; };
	
	this.arguments = function () { return args; };

	this.toObject = function () {
		var obj = {
			type: this.cmdtype(),
			name: this.name(),
			body: this.body().toObject(),
			modifiers: this.modifiers()
		};
		
		if (this.returns() != null)
			obj.returns = this.returns().name();
		
		var args = this.arguments();
		
		if (args && args.length) {
			obj.arguments = [];
			
			for (var i = 0; i < args.length; i++)
				obj.arguments.push({
					name: args[i].name,
					type: args[i].type.name()
				});
		}
		
		return obj;
	};
}

function IfCommand(cond, thencmd, elsecmd) {
	this.cmdtype = function () { return "IfCommand"; };
	
	this.condition = function () { return cond; };
	
	this.thencmd = function () { return thencmd; };
	
	this.elsecmd = function () { return elsecmd; };

	this.toObject = function () {
		var obj = {
			type: this.cmdtype(),
			condition: this.condition().toObject(),
			thencmd: this.thencmd().toObject()
		};
		
		if (this.elsecmd() != null)
			obj.elsecmd = this.elsecmd().toObject();
		
		return obj;
	}
}

function WhileCommand(cond, cmd) {
	this.cmdtype = function () { return "WhileCommand"; };
	
	this.condition = function () { return cond; };
	
	this.command = function () { return cmd; };
	
	this.toObject = function () {
		return {
			type: this.cmdtype(),
			condition: this.condition().toObject(),
			command: this.command().toObject()
		};
	}
}

function ForCommand(precmd, cond, postcmd, cmd) {
	this.cmdtype = function () { return "ForCommand"; };
	
	this.precmd = function () { return precmd; };
	
	this.condition = function () { return cond; };
	
	this.postcmd = function () { return postcmd; };
	
	this.command = function () { return cmd; };

	this.toObject = function () {
		return {
			type: this.cmdtype(),
			condition: this.condition().toObject(),
			initcommand: this.precmd().toObject(),
			postcommand: this.postcmd().toObject(),
			command: this.command().toObject()
		};
	}
}

function CompositeCommand(cmds) {
	this.cmdtype = function () { return "CompositeCommand"; };

	this.commands = function () { return cmds; }

	this.toObject = function () {
		var obj = {
			type: this.cmdtype(),
			commands: []
		};
		
		cmds.forEach(function (cmd) {
			obj.commands.push(cmd.toObject());
		});
		
		return obj;
	}
}

function ContinueCommand() {
	this.cmdtype = function () { return "ContinueCommand"; };

	this.toObject = function () {
		return {
			type: this.cmdtype()
		}
	}
}

function BreakCommand() {
	this.cmdtype = function () { return "BreakCommand"; };

	this.toObject = function () {
		return {
			type: this.cmdtype()
		}
	}
}

function ExpressionCommand(expr) {
	this.cmdtype = function () { return "ExpressionCommand"; };

	this.expression = function () { return expr; }

	this.toObject = function () {
		return {
			type: this.cmdtype(),
			expression: this.expression().toObject()
		}
	}
}

function ReturnCommand(expr) {
	this.cmdtype = function () { return "ReturnCommand"; };

	this.expression = function () { return expr; }

	this.toObject = function () {
		var obj = {
			type: this.cmdtype()
		}
		
		var expr = this.expression();
		
		if (expr != null)
			obj.expression = expr.toObject();
		
		return obj;
	};
}

function AssignmentExpression(lvalue, expr) {
	this.exprtype = function () { return "AssignmentExpression"; };

	this.lvalue = function () { return lvalue; }

	this.expression = function () { return expr; }
	
	this.toObject = function () {
		return {
			type: this.exprtype(),
			lvalue: this.lvalue().toObject(),
			expression: this.expression().toObject()
		}
	}
}

function IntegerExpression(value) {
	this.exprtype = function () { return "IntegerExpression"; };

	this.value = function() { return value; }
	
	this.toObject = function () {
		return {
			type: this.exprtype(),
			value: this.value()
		}
	};
}

function StringExpression(value) {
	this.exprtype = function () { return "StringExpression"; };

	this.value = function() { return value; }
	
	this.toObject = function () {
		return {
			type: this.exprtype(),
			value: this.value()
		}
	};
}

function BooleanExpression(value) {
	this.exprtype = function () { return "BooleanExpression"; };

	this.value = function() { return value; }

	this.toObject = function () {
		return {
			type: this.exprtype(),
			value: this.value()
		}
	};
}

function NameExpression(name) {
	this.exprtype = function () { return "NameExpression"; };

	this.name = function () { return name; }
    
	this.lvalue = true;

	this.toObject = function () {
		return {
			type: this.exprtype(),
			name: this.name()
		}
	};
}

function BinaryExpression(oper, left, right) {
	this.exprtype = function () { return "BinaryExpression"; };

	this.operator = function () { return oper; };
	
	this.left = function () { return left; };
	
	this.right = function () { return right; };

	this.toObject = function () {
		return {
			type: this.exprtype(),
            operator: this.operator(),
			left: this.left().toObject(),
			right: this.right().toObject()
		}
	};
}

function UnaryExpression(oper, expr) {
	this.exprtype = function () { return "UnaryExpression"; };

	this.operator = function () { return oper; };
	
	this.expression = function () { return expr; };

	this.toObject = function () {
		return {
			type: this.exprtype(),
            operator: this.operator(),
			expression: this.expression().toObject()
		}
	};
}

function PostUnaryExpression(expr, oper) {
	this.exprtype = function () { return "PostUnaryExpression"; };

	this.operator = function () { return oper; };
	
	this.expression = function () { return expr; };

	this.toObject = function () {
		return {
			type: this.exprtype(),
            operator: this.operator(),
			expression: this.expression().toObject()
		}
	};
}

function DotExpression(expr, name) {
	this.exprtype = function () { return "DotExpression"; };

	this.expression = function () { return expr; };

	this.name = function () { return name; };

	this.toObject = function () {
		return {
			type: this.exprtype(),
            name: this.name(),
			expression: this.expression().toObject()
		}
	};
}

function CallExpression(expr, args)
 {
	this.exprtype = function () { return "CallExpression"; };

	this.expression = function () { return expr; };

	this.arguments = function () { return args; };

	this.toObject = function () {
		var obj = {
			type: this.exprtype(),
			expression: this.expression().toObject(),
			arguments: []
		}
		
		args.forEach(function (arg) {
			obj.arguments.push(arg.toObject());
		});
		
		return obj;
	};
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
		
		if (tryParseToken(TokenType.Name, 'library')) {
			var name = parseName();
            var body = parseCommand();
            
            return new LibraryCommand(name, body);
		}

		if (tryParseToken(TokenType.Name, 'function')) {
			var name = null;
			var args = null;
			
			if (tryParseToken(TokenType.Punctuation, '(')) {
				args = parseFunctionArguments();
				parseToken(TokenType.Punctuation, ')');
			}
			else {
				name = parseName();
				parseToken(TokenType.Punctuation, '(');
				args = parseFunctionArguments();
				parseToken(TokenType.Punctuation, ')');
			}
			
			var returns = null;
			var modifiers = { internal: true, external: false };
			
			if (tryParseToken(TokenType.Name, 'external')) {
				modifiers.internal = false;
				modifiers.external = true;
			}
			
			if (tryParseToken(TokenType.Name, 'payable'))
				modifiers.payable = true;
				
			if (tryParseToken(TokenType.Name, 'returns')) {
				parseToken(TokenType.Punctuation, '(');
				returns = tryParseType();
				parseToken(TokenType.Punctuation, ')');
			}
			
            var body = parseCommand();
            
            return new FunctionCommand(name, args, modifiers, returns, body);
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
			
			if (token.type === TokenType.Operator && rigthunioperators.indexOf(token.value) >= 0) {
				expr = new PostUnaryExpression(expr, token.value);
				continue;
			}

			if (token.type === TokenType.Punctuation && token.value === '.') {
				expr = new DotExpression(expr, parseName());
				continue;
			}

			if (token.type === TokenType.Punctuation && token.value === '(') {
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
	
	function parseFunctionArguments() {
		var args = [];
		
		while (!tryPeekToken(TokenType.Punctuation, ')')) {
			if (args.length)
				parseToken(TokenType.Punctuation, ',');
			
			args.push(parseTypeName());
		}
		
		return args;
	}
	
	function parseSimpleTerm() {
		var token = lexer.nextToken();
		
		if (!token)
			return null;
		
		if (token.type === TokenType.Operator && leftunioperators.indexOf(token.value) >= 0)
			return new UnaryExpression(token.value, parseSimpleTerm());
		
        if (token.type === TokenType.Integer)		
            return new IntegerExpression(parseInt(token.value));
            
        if (token.type === TokenType.String)
            return new StringExpression(token.value);

        if (token.type === TokenType.Name)
            return new NameExpression(token.value);

        if (token.type === TokenType.Boolean) {
			if (token.value === "true")
				return new BooleanExpression(true);
			if (token.value === "false")
				return new BooleanExpression(false);
		}
	}
	
	function tryParseToken(type, value) {
		var token = lexer.nextToken();
		
		if (token != null && token.type === type && token.value === value)
			return true;
		
		lexer.pushToken(token);
		
		return false;
	}
	
	function tryPeekToken(type, value) {
		var token = lexer.nextToken();
		
		lexer.pushToken(token);
		
		if (token != null && token.type === type && token.value === value)
			return true;
		
		return false;
	}
	
	function tryParseType() {
		var token = lexer.nextToken();
		
		if (token != null && token.type === TokenType.Name && types.indexOf(token.value) >= 0) {
			var arity = [];
			
			while (tryParseToken(TokenType.Punctuation, '[')) {
				parseToken(TokenType.Punctuation, ']');
				token.value += '[]';
				arity.push(-1);
			}
			
			return new TypeDescription(token.value, arity);			
		}
		
		lexer.pushToken(token);
		
		return null;
	}
	
	function parseType() {
		var type = tryParseType();
		
		if (type == null)
			throw new Error("Expected type");
		
		return type;
	}
	
	function parseTypeName() {
		var type = parseType();
		var name = parseName();
		
		return {
			type: type,
			name: name
		};
	}
	
	function parseToken(type, value) {
		var token = lexer.nextToken();
		
		if (token == null || token.type !== type || token.value !== value)
			throw new Error("Expected '" + value + "'");
		
		return false;
	}
	
	function parseName() {
		var token = lexer.nextToken();
		
		if (token == null || token.type !== TokenType.Name)
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

