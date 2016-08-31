
function Parser(text) {
	this.parseExpression = function() {
		return null;
	}
}

function createParser(text) {
	return new Parser(text);
}

module.exports = {
	parser: createParser
}

