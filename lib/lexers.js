
var TokenType = { Name: 1, Integer: 2, Operator: 3, Punctuation: 4 };

var punctuations = [ '{', '}', ',', ';' ];
var operators = [ '<', '>', '<=', '>=', '==', '!=', '+', '-', '*', '/', '%', '**' ];

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
		
		if (punctuations.indexOf(text[position]) >= 0)
			return { value: text[position++], type: TokenType.Punctuation };
		
		if (position < length - 1 && operators.indexOf(text[position] + text[position+1]) >= 0) {
			var result = { value: text[position] + text[position+1] , type: TokenType.Operator };
			position += 2;
			return result;
		}
		
		if (operators.indexOf(text[position]) >= 0)
			return { value: text[position++], type: TokenType.Operator };

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

