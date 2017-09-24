
function Compiler() {
    this.compileInteger = function (expr) {
        return expr.value().toString();
    }
    
    this.compileString = function (expr) {
        return JSON.stringify(expr.value());
    }
    
    this.compileName = function (expr) {
        return expr.name();
    }
}

function createCompiler() {
    return new Compiler();
}

module.exports = {
    compiler: createCompiler
};