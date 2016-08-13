
var TokenType = { Name: 1, Integer: 2 };

function Lexer(text) {
	text = text || '';
	var length = text.length;
	var position = 0;
	
	this.nextToken = function () { 
		if (!text)
			return null;
		
		while (position < length && isWhiteSpace(text[position]))
			position++;
		
		if (position >= length)
			return null;
		
		var value = '';

		if (isLetter(text[position])) {
			while (position < length && isLetter(text[position]))
				value += text[position++];
			var token = { value: value, type: TokenType.Name }; 
		}
		else if (isDigit(text[position])) {
			while (position < length && isDigit(text[position]))
				value += text[position++];
			var token = { value: value, type: TokenType.Integer }; 
		}
		
		return token;
	};
	
	function isWhiteSpace(ch) {
		return ch <= ' ';
	}
	
	function isDigit(ch) {
		return ch >= '0' && ch <= '9';
	}
	
	function isLetter(ch) {
		return ch >= 'A' && ch <= 'Z' || ch >= 'a' && ch <= 'z';
	}
}

module.exports = {
    lexer: function (text) { return new Lexer(text); },
	TokenType: TokenType
};

