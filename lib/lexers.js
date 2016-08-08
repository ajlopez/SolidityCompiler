
var TokenType = { Name: 1 };

function Lexer(text) {
	this.nextToken = function () { return { value: text, type: TokenType.Name }; }
}

module.exports = {
    lexer: function (text) { return new Lexer(text); },
	TokenType: TokenType
};

