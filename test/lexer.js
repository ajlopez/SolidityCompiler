
var lexers = require('../lib/lexers');

exports['create lexer'] = function (test) {
    var lexer = lexers.lexer();
    
    test.ok(lexer);
    test.equal(typeof lexer, 'object');
};



