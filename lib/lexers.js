
var TokenType = { Name: 1 };

function Lexer(text) {
	text = text || '';
	var length = text.length;
	var position = 0;
	
	this.nextToken = function () { 
		if (!text)
			return null;
		
		while (position < length && text[position] == ' ')
			position++;
		
		if (position >= length)
			return null;
		
		var value = '';

		while (position < length && text[position] != ' ')
			value += text[position++];
		
		var token = { value: value, type: TokenType.Name }; 
		
		return token;
	};
}

module.exports = {
    lexer: function (text) { return new Lexer(text); },
	TokenType: TokenType
};

