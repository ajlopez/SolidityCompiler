
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

var types = [ 'string', 'bytes', 'byte', 'int', 'uint', 'bool', 'address', 'fixed', 'ufixed' ];

for (var k = 1; k <= 32; k++) {
	types.push('int' + (k*8));
	types.push('uint' + (k*8));	
	types.push('bytes' + k);	
}

function ArgumentDescriptor(type, name) {
    this.type = function () { return type; };
    this.name = function () { return name; };
}

function TypeDescription(type, lens) {
    var types;
    
	if (type === 'int')
		type = 'int256';
	
	if (type === 'uint')
		type = 'uint256';
	
	var name = type;

    if (name === 'tuple') {
        types = lens;
        lens = null;
        
        this.types = function () { return types; };
    }
	else if (lens && lens.length)
		for (var k = 0; k < lens.length; k++)
			name += '[]';
	
	this.name = function () { return name; };
	
	if (lens) {
		this.length = function (pos) { return lens[pos]; }; 

		this.dimensions = function () { return lens.length; };
	}
}

function VarCommand(type, visibility, name, expr) {
	this.cmdtype = function () { return "VarCommand"; };
	
	this.type = function () { return type; };
	
	this.visibility = function () { return visibility; };

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
    
    this.compile = function (compiler) {
        return compiler.compileVariable(this);
    }
}

function ContractCommand(name, body, is) {
	this.cmdtype = function () { return "ContractCommand"; };
	
    this.name = function () { return name; };
    
    this.body = function () { return body; };
    
    this.is = function () { return is; };
	
	this.toObject = function () {
		return {
			type: this.cmdtype(),
			name: this.name(),
            is: this.is(),
			body: this.body().toObject()
		};
	};
    
    this.compile = function (compiler) {
        return compiler.compileContract(this);
    };
}

function StructCommand(name, fields) {
	this.cmdtype = function () { return "StructCommand"; };
	
    this.name = function () { return name; };
    
    this.fields = function () { return fields; };
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

function ConstructorCommand(args, visibility, modifiers, body) {	
	this.cmdtype = function () { return "ConstructorCommand"; };
	
    this.name = function () { return name; };
	
	this.arity = function () {
		if (!args)
			return 0;
		
		return args.length;
	}
    
    this.body = function () { return body; };

	this.modifiers = function () { return modifiers; };

	this.visibility = function () { return visibility; };
	
	this.arguments = function () { return args; };

	this.toObject = function () {
		var obj = {
			type: this.cmdtype(),
			body: this.body().toObject()
		};
		
		if (visibility)
			obj.visibility = visibility;
		
		if (modifiers)
			obj.modifiers = modifiers;
		
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

function FunctionCommand(name, args, visibility, modifiers, returns, body) {	
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

	this.visibility = function () { return visibility; };
	
	this.arguments = function () { return args; };

	this.toObject = function () {
		var obj = {
			type: this.cmdtype(),
			name: this.name(),
			body: this.body().toObject()
		};
		
		if (visibility)
			obj.visibility = visibility;
		
		if (modifiers)
			obj.modifiers = modifiers;
		
		if (this.returns() != null) {
			obj.returns = this.returns().name();
            
            if (obj.returns === 'tuple') {
                obj.returns = [];
                var ttypes = this.returns().types();
                
                for (var nt = 0; nt < ttypes.length; nt++)
                    obj.returns.push(ttypes[nt].name());
            }
        }
		
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
    
    this.compile = function (compiler) {
        return compiler.compileFunction(this);
    }
}

function ModifierCommand(name, args, body) {	
	this.cmdtype = function () { return "ModifierCommand"; };
	
    this.name = function () { return name; };
	
	this.arity = function () {
		if (!args)
			return 0;
		
		return args.length;
	}
    
    this.body = function () { return body; };
	
	this.arguments = function () { return args; };

	this.toObject = function () {
		var obj = {
			type: this.cmdtype(),
			name: this.name(),
			body: this.body().toObject()
		};
				
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

function EventCommand(name, args) {	
	this.cmdtype = function () { return "EventCommand"; };
	
    this.name = function () { return name; };
	
	this.arity = function () {
		if (!args)
			return 0;
		
		return args.length;
	}
	
	this.arguments = function () { return args; };

	this.toObject = function () {
		var obj = {
			type: this.cmdtype(),
			name: this.name()
		};
		
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
    
    this.compile = function (compiler) {
        return compiler.compileComposite(this);
    }
}

function ContinueCommand() {
	this.cmdtype = function () { return "ContinueCommand"; };

	this.toObject = function () {
		return {
			type: this.cmdtype()
		}
	}
    
    this.compile = function (compiler) {
        return compiler.compileContinue(this);
    }
}

function BreakCommand() {
	this.cmdtype = function () { return "BreakCommand"; };

	this.toObject = function () {
		return {
			type: this.cmdtype()
		}
	}
    
    this.compile = function (compiler) {
        return compiler.compileBreak(this);
    }
}

function ThrowCommand() {
	this.cmdtype = function () { return "ThrowCommand"; };

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
    
    this.compile = function (compiler) {
        return compiler.compileExpressionCommand(this);
    }
}

function EmitCommand(name, args)
{
	this.exprtype = function () { return "EmitCommand"; };

	this.name = function () { return name; };

	this.arguments = function () { return args; };

	this.toObject = function () {
		var obj = {
			type: this.exprtype(),
			name: this.name(),
			arguments: []
		}
		
		args.forEach(function (arg) {
			obj.arguments.push(arg.toObject());
		});
		
		return obj;
	};
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
    
    this.compile = function (compiler) {
        return compiler.compileReturn(this);
    }
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
    
    this.compile = function (compiler) {
        return compiler.compileAssignment(this);
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
    
    this.compile = function (compiler) {
        return compiler.compileInteger(this);
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
    
    this.compile = function (compiler) {
        return compiler.compileString(this);
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
    
    this.compile = function (compiler) {
        return compiler.compileBoolean(this);
    }
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
    
    this.compile = function (compiler) {
        return compiler.compileName(this);
    }
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
    
    this.compile = function (compiler) {
        return compiler.compileBinary(this);
    }
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
    
    this.compile = function (compiler) {
        return compiler.compileCall(this);
    }
}

function Parser(text) {
	var lexer = lexers.lexer(text);
    var contracts = {};
    var structs = {};
    var events = {};
	
	this.parseExpression = function() {
		return parseExpression();
	}
	
	this.parseCommand = function() {
		return parseCommand();
	}
    
    this.contracts = function () { return contracts; }
    this.structs = function () { return structs; }
    this.events = function () { return events; }
    
    var parsefns = {};
    
    parsefns.return = parseReturnCommand;
    parsefns.for = parseForCommand;
    parsefns.break = parseBreakCommand;
    parsefns.continue = parseContinueCommand;
    parsefns.emit = parseEmitCommand;
    parsefns.constructor = parseConstructorCommand;
    parsefns.if = parseIfCommand;
    parsefns.while = parseWhileCommand;
    parsefns.contract = parseContractCommand;
    parsefns.event = parseEventCommand;
    parsefns.modifier = parseModifierCommand;
    parsefns.throw = parseThrowCommand;
    parsefns.library = parseLibraryCommand;
    parsefns.struct = parseStructCommand;
    parsefns.function = parseFunctionCommand;
	
	function parseCommand() {
        var nameToken = tryParseName();
        
        if (nameToken)
            if (parsefns[nameToken.value])
                return parsefns[nameToken.value]();
            else
                lexer.pushToken(nameToken);

		var type = tryParseType();

		if (type) {
			var visibility = tryParseVisibility();
			var name = parseName();
            var expr;
            
            if (tryParseToken(TokenType.Operator, '='))
                var expr = parseExpression();
            
            var cmd = new VarCommand(type, visibility, name, expr);
			
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

    function parseBreakCommand() {
        var cmd = new BreakCommand();
        tryParseToken(TokenType.Punctuation, ';');
        return cmd;
    }
        
    function parseForCommand() {
        parseToken(TokenType.Punctuation, '(');
        var precmd = parseCommand();
        var cond = parseExpression();
        
        parseToken(TokenType.Punctuation, ';');
        
        var postcmd = parseCommand();
        parseToken(TokenType.Punctuation, ')');
        
        var cmd = parseCommand();
        
        return new ForCommand(precmd, cond, postcmd, cmd);
    }
        
    function parseWhileCommand() {
        parseToken(TokenType.Punctuation, '(');
        var cond = parseExpression();
        parseToken(TokenType.Punctuation, ')');
        var cmd = parseCommand();
        
        return new WhileCommand(cond, cmd);
    }
        
    function parseIfCommand() {
        parseToken(TokenType.Punctuation, '(');
        var cond = parseExpression();
        parseToken(TokenType.Punctuation, ')');
        var thencmd = parseCommand();
        var elsecmd = null;
        
        if (tryParseToken(TokenType.Name, 'else'))
            elsecmd = parseCommand();
        
        return new IfCommand(cond, thencmd, elsecmd);
    }

    function parseLibraryCommand() {
        var name = parseName();
        var body = parseCommand();
        
        return new LibraryCommand(name, body);
    }        

    function parseEmitCommand() {
        var name = parseName();
        var args = [];
        
        parseToken(TokenType.Punctuation, '(');
        
        while (!tryParseToken(TokenType.Punctuation, ')')) {
            if (args.length)
                parseToken(TokenType.Punctuation, ',');
            
            args.push(parseExpression());
        }
        
        return new EmitCommand(name, args);
    }

    function parseEventCommand() {
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
        }
                    
        var cmd = new EventCommand(name, args);
        
        events[name] = cmd;
        
        return cmd;
    }
        
    function parseModifierCommand() {
        var name = null;
        var args = null;
        
        name = parseName();
        parseToken(TokenType.Punctuation, '(');
        args = parseFunctionArguments();
        
        var body = parseCommand();
        
        return new ModifierCommand(name, args, body);
    }

    function parseConstructorCommand() {
        parseToken(TokenType.Punctuation, '(');
        var args = parseFunctionArguments();
        
        var modifiers = null;
        var visibility = tryParseVisibility();
        
        var token = null;
        
        while (token = tryParseName())  {
            if (!modifiers)
                modifiers = [];
            
            modifiers.push(token.value);
        }
        
        var body = parseCommand();
        
        return new ConstructorCommand(args, visibility, modifiers, body);
    }
        
    function parseFunctionCommand() {
        var name = null;
        var args = null;
        
        if (tryParseToken(TokenType.Punctuation, '(')) {
            args = parseFunctionArguments();
        }
        else {
            name = parseName();
            parseToken(TokenType.Punctuation, '(');
            args = parseFunctionArguments();
        }
        
        var returns = null;
        var modifiers = null;
        var visibility = tryParseVisibility();
        
        var token = null;
        
        while ((token = tryParseName()) && token.value !== 'returns')  {
            if (!modifiers)
                modifiers = [];
            
            modifiers.push(token.value);
        }
            
        if (token && token.value === 'returns') {
            parseToken(TokenType.Punctuation, '(');
            returns = tryParseType();
            
            if (tryParseToken(TokenType.Punctuation, ',')) {
                returns = [ returns ];
                
                returns.push(parseType());
                
                while (tryParseToken(TokenType.Punctuation, ','))
                    returns.push(parseType());
                
                returns = new TypeDescription('tuple', returns);
            }
            
            parseToken(TokenType.Punctuation, ')');
        }
        
        var body = parseCommand();
        
        return new FunctionCommand(name, args, visibility, modifiers, returns, body);
    }
    
    function parseContractCommand() {
        var name = parseName();
        var is = [];
        
        if (tryParseToken(TokenType.Name, 'is')) {
            var pname = parseName();
            is = [ pname ];
            
            while (tryParseToken(TokenType.Punctuation, ','))
                is.push(parseName());
        }
        
        var body = parseCommand();
        
        var cmd = new ContractCommand(name, body, is);
        
        contracts[name] = cmd;
        
        return cmd;
    }
      
    function parseReturnCommand() {
        var cmd = new ReturnCommand(parseExpression());
        tryParseToken(TokenType.Punctuation, ';');
        return cmd;
    }

    function parseContinueCommand() {
        var cmd = new ContinueCommand();
        tryParseToken(TokenType.Punctuation, ';');
        return cmd;
    }

    function parseThrowCommand() {
        var cmd = new ThrowCommand();
        tryParseToken(TokenType.Punctuation, ';');
        return cmd;
    }
    
    function parseStructCommand() {
        var name = parseName();
        var fields = [];
        
        parseToken(TokenType.Punctuation, '{');
        
        while (!tryParseToken(TokenType.Punctuation, '}'))
            fields.push(parseVariable());
        
        var cmd = new StructCommand(name, fields);
        
        structs[name] = cmd;
        
        return cmd;
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
		
		while (token && token.type === TokenType.Operator && binoperators[level].indexOf(token.value) >= 0) {
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
    
    function parseList(ending, separator, fnparse) {
        var list = [];
        
		while (!tryParseToken(TokenType.Punctuation, ending)) {
			if (list.length)
				parseToken(TokenType.Punctuation, separator);
			
			list.push(fnparse());
		}
		
		return list;
    }
	
	function parseArguments() {
        return parseList(')', ',', parseExpression);
	}
	
	function parseFunctionArguments() {
        return parseList(')', ',', parseTypeName);
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
		
		lexer.pushToken(token);
	}
    
    function parseVariable() {
		var type = parseType();
        var name = parseName();
        var cmd = new VarCommand(type, null, name, null);
			
        parseToken(TokenType.Punctuation, ';');
			
        return cmd;
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
    
    function isTypeToken(token) {
        if (token == null)
            return false;
        
        if (token.type !== TokenType.Name)
            return false;
        
        if (types.indexOf(token.value) >= 0)
            return true;
        
        if (structs[token.value])
            return true;
        
        return false;
    }
	
	function tryParseType() {
		var token = lexer.nextToken();
		
		if (isTypeToken(token)) {
			var arity = [];
			
			while (tryParseToken(TokenType.Punctuation, '[')) {
				var sizeexpr = parseExpression() || -1;
				parseToken(TokenType.Punctuation, ']');
				arity.push(sizeexpr);
			}
			
			return new TypeDescription(token.value, arity);			
		}
		
		lexer.pushToken(token);
		
		return null;
	}
	
	function tryParseName(expected) {
		var token = lexer.nextToken();
		
		if (token != null && token.type === TokenType.Name)
            if (!expected || expected === TokenType.Value)
                return token;
		
		lexer.pushToken(token);
		
		return null;
	}
	
	function tryParseVisibility() {
		if (tryParseToken(TokenType.Name, 'public'))
			return 'public';
		
		if (tryParseToken(TokenType.Name, 'private'))
			return 'private';

		if (tryParseToken(TokenType.Name, 'internal'))
			return 'internal';

		if (tryParseToken(TokenType.Name, 'external'))
			return 'external';
		
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

