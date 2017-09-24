
function makeConstant(expr) {
    expr.java = expr.java || {};
    
    expr.java.constant = true;
}

function isConstant(expr) {
    return expr.java && expr.java.constant;
}

function Compiler() {
    this.compileInteger = function (expr) {
        makeConstant(expr);
        return expr.value().toString();
    }
    
    this.compileString = function (expr) {
        makeConstant(expr);
        return JSON.stringify(expr.value());
    }
    
    this.compileBoolean = function (expr) {
        makeConstant(expr);
        return expr.value().toString();
    }
    
    this.compileName = function (expr) {
        return expr.name();
    }
    
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
    }
    
    this.compileAssignment = function (expr) {
        return expr.lvalue().compile(this) + '.set(' + expr.expression().compile(this) + ')';
    }
    
    this.compileBinary = function (expr) {
        var operator = expr.operator();
        var left = expr.left();
        var right = expr.right();
        
        var leftcode = left.compile(this);
        var rightcode = right.compile(this);
        
        if (isConstant(left) && isConstant(right))
            return leftcode + ' ' + operator + ' ' + rightcode;
        
        if (isConstant(left))
            return rightcode + '.add(' + leftcode + ')';
        
        return leftcode + '.add(' + rightcode + ')';
    }
}

function createCompiler() {
    return new Compiler();
}

module.exports = {
    compiler: createCompiler
};