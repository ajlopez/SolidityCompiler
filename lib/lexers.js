
const gelex = require('gelex');
const ldef = gelex.definition();

var TokenType = { Name: 'name', Integer: 'integer', String: 'string', Boolean: 'boolean', Operator: 'operator', Punctuation: 'punctuation' };

var punctuations = [ '{', '}', ',', ';', '[', ']', '.', '(', ')' ];
var operators = [ '<', '>', '=>', '<=', '>=', '==', '!=', '+', '-', '*', '/', '%', '**', '!', '||', '&&', '!', '|', '&', '^', '~', '<<', '>>', '++', '--', '=' ];

ldef.define(TokenType.Integer, '[0-9][0-9]*');
ldef.define(TokenType.Boolean, 'true');
ldef.define(TokenType.Boolean, 'false');
ldef.define(TokenType.Name, '[a-zA-Z_][a-zA-Z0-9_]*');
ldef.defineText(TokenType.String, '"', '"');
ldef.define(TokenType.Operator, operators);
ldef.define(TokenType.Punctuation, punctuations);
ldef.defineComment('//');
ldef.defineComment('/*', '*/');

function Lexer(text) {
    const lexer = ldef.lexer(text);
    const tokens = [];
    
    this.pushToken = function (token) {
        tokens.push(token);
    }
    
    this.nextToken = function () {
        if (tokens.length)
            return tokens.pop();
        
        return lexer.next();
    };
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    lexer: createLexer,
    TokenType: TokenType
}
