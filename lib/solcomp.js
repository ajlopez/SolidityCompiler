
var parsers = require('./parsers');

function compileCode(code, options) {
	var parser = parsers.parser(code);
	var pgm = parser.parseCommand();

	var compiler = require('./compilers/' + options.target).compiler();
    
    return compiler.compileProgram(pgm, options);
}

module.exports = {
    compileCode: compileCode
};

