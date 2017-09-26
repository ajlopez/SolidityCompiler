
var parsers = require('../parsers');

var commutatives = [ '+', '*' ];

var binfunctions = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply'
};

var types = {
    'int256': 'Int256',
    'uint256': 'UInt256',
    'string': 'String',
}

function indent(line) {
    if (!line.length)
        return line;
    
    return '    ' + line;
}

function addIndent(array, lines, blanks) {
    var nlines = 0;
    lines.forEach(function (line) {
        if (Array.isArray(line)) {
            if (blanks && nlines)
                array.push('');
            
            nlines++;
            
            return addIndent(array, line, false);
        }
        
        if (blanks && nlines && line.length && line[0] !== ' ')
            array.push('');
        
        array.push(indent(line));
        
        nlines++;
    });
}

function makeConstant(expr) {
    expr.java = expr.java || {};
    
    expr.java.constant = true;
}

function isConstant(expr) {
    return expr.java && expr.java.constant;
}

function plainOperator(oper) {
    return oper;
}

function functionOperator(oper) {
    return binfunctions[oper];
}

function isCommutative(oper) {
    return commutatives.indexOf(oper) >= 0;
}

function compileType(typedesc) {
    return types[typedesc.name()];
}

function Compiler() {
    this.compileInteger = function (expr) {
        makeConstant(expr);
        return expr.value().toString();
    };
    
    this.compileString = function (expr) {
        makeConstant(expr);
        return JSON.stringify(expr.value());
    };
    
    this.compileBoolean = function (expr) {
        makeConstant(expr);
        return expr.value().toString();
    };
    
    this.compileName = function (expr) {
        return expr.name();
    };
    
    this.compileCall = function (expr) {
        var self = this;
        var code = expr.expression().compile(this);
        
        code += '(';
        
        var narg = 0;
        
        expr.arguments().forEach(function (arg) {
            if (narg)
                code += ', ';
            
            code += arg.compile(self);
            narg++;
        });
        
        code += ')';
        
        return code;
    };
    
    this.compileAssignment = function (expr) {
        return expr.lvalue().compile(this) + '.set(' + expr.expression().compile(this) + ')';
    };
    
    this.compileBinary = function (expr) {
        var operator = expr.operator();
        var left = expr.left();
        var right = expr.right();
        
        var leftcode = left.compile(this);
        var rightcode = right.compile(this);
        var plainop = plainOperator(operator);
        var fnop = functionOperator(operator);
        
        if (isConstant(left) && isConstant(right))
            return leftcode + ' ' + plainOperator(operator) + ' ' + rightcode;
        
        if (isConstant(left))
            if (isCommutative(operator))
                return rightcode + '.' + functionOperator(operator) + '(' + leftcode + ')';
            else
                return rightcode + '.' + functionOperator(operator) + 'From(' + leftcode + ')';
        
        return leftcode + '.' + functionOperator(operator) + '(' + rightcode + ')';
    };
    
    this.compileReturn = function (cmd) {
        var expr = cmd.expression();
        
        if (!expr)
            return 'return;';
        
        return 'return ' + expr.compile(this) + ';';
    };
    
    this.compileBreak = function (cmd) {
        return 'break;';
    };
    
    this.compileContinue = function (cmd) {
        return 'continue;';
    };

    this.compileComposite = function (cmd) {
        var self = this;
        var result = [];
        
        cmd.commands().forEach(function (command) {
            result.push(command.compile(self));
        });
        
        return result;
    }
    
    this.compileExpressionCommand = function (cmd) {
        return cmd.expression().compile(this) + ';';
    }
    
    this.compileVariable = function (cmd) {
        var type = compileType(cmd.type());
        var name = cmd.name();
        var expr = cmd.expression();
        
        if (type === 'String')        
            return type + ' ' + name + (expr ? ' = ' + expr.compile(this) : '') + ';';
        else
            return type + ' ' + name + ' = new ' + type + '(' + (expr ? expr.compile(this) : '') + ');';
    }
    
    this.compileFunction = function (cmd) {
        var rettype = cmd.returns();
        var decl = 'public ' + (rettype ? compileType(rettype) : 'void') + ' ' + cmd.name() + '(';
        var nargs = 0;
        
        var body = cmd.body().compile(this);
        
        cmd.arguments().forEach(function (arg) {
            if (nargs)
                decl += ', ';
            
            decl += compileType(arg.type) + ' ' + arg.name;
            
            nargs++;
        });
        
        decl += ') {';
        
        var result = [ decl ];
        
        addIndent(result, body, true);
        
        result.push('}');

        return result;
    }
    
    this.compileContract = function (cmd) {
        var decl = 'public class ' + cmd.name() + ' extends Contract {';
        var body = cmd.body().compile(this);

        var result = [ decl ];
        
        addIndent(result, body, true);
        
        result.push('}');

        return result;
    }
    
    this.compileCode = function (code, options) {
        var parser = parsers.parser(code);
        var cmd = parser.parseCommand();
        var result = cmd.compile(this);
        
        var prologue = [];
        
        if (options.package) {
            prologue.push('package ' + options.package + ';');
            prologue.push('');
        }
        
        if (options.basePackage) {
            prologue.push('import ' + options.basePackage + ';');
            prologue.push('');
        }
        
        return prologue.concat(result).join('\n');
    }
}

function createCompiler() {
    return new Compiler();
}

module.exports = {
    compiler: createCompiler
};

