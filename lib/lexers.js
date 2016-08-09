
var TokenType = { Name: 1 };

function Lexer(text) {
	this.nextToken = function () { 
		if (!text)
			return null;
		
		var token = { value: text.trim(), type: TokenType.Name }; 
		
		text = null;
		
		return token;
	};
}

module.exports = {
    lexer: function (text) { return new Lexer(text); },
	TokenType: TokenType
};

