
var solcomp = require('..');

exports['compile Java simple contract'] = function (test) {
    var source = 'contract Simple { int counter; function setCounter(int value) { counter = value; } function getCounter() returns(int) { return counter; } }';
    
    var options = {
        target: 'java',
        package: 'com.ajlopez.contracts.samples',
        basePackage: 'com.ajlopez.contracts'
    }
    
    var result = solcomp.compileCode(source, options);
    
    var expected = [
        'package com.ajlopez.contracts.samples;',
        '',
        'import com.ajlopez.contracts;',
        '',
        'public class Simple extends Contract {',
        '    Int256 counter = new Int256();',
        '',
        '    public void setCounter(Int256 value) {',
        '        counter.set(value);',
        '    }',
        '',
        '    public Int256 getCounter() {',
        '        return counter;',
        '    }',
        '}'
    ].join('\n');
    
    test.equal(result, expected);
};

