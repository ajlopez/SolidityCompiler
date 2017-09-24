
var commutatives = [ '+', '*' ];

var binfunctions = {
    '+': 'Add',
    '-': 'Subtract',
    '*': 'Multiply'
};

var types = {
    'int256': 'Int256',
    'uint256': 'UInt256',
    'string': 'string',
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
        return expr.lvalue().compile(this) + '.Set(' + expr.expression().compile(this) + ')';
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
        
        
        if (type === 'string')        
            return type + ' ' + name + (expr ? ' = ' + expr.compile(this) : '') + ';';
        else
            return type + ' ' + name + ' = new ' + type + '(' + (expr ? expr.compile(this) : '') + ');';
    }
}

function createCompiler() {
    return new Compiler();
}

module.exports = {
    compiler: createCompiler
};

