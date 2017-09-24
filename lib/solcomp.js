
function compileCode(code, options) {
    var compiler = require('./compilers/' + options.target).compiler();
    
    return compiler.compileCode(code, options);
}

module.exports = {
    compileCode: compileCode
};

