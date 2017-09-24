
function Compiler() {
    this.compileInteger = function (expr) {
        return expr.value().toString();
    }
}

function createCompiler() {
    return new Compiler();
}

module.exports = {
    compiler: createCompiler
};