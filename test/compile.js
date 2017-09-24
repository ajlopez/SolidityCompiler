
var solcomp = require('..');

exports['compile simple contract to Java code'] = function (test) {
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

exports['compile simple contract to C# code'] = function (test) {
    var source = 'contract Simple { int counter; function setCounter(int value) { counter = value; } function getCounter() returns(int) { return counter; } }';
    
    var options = {
        target: 'csharp',
        namespace: 'Contracts.Samples',
        baseNamespace: 'Contracts'
    }
    
    var result = solcomp.compileCode(source, options);
    
    var expected = [
        'namespace Contracts.Samples {',
        '    import Contracts;',
        '',
        '    public class Simple : Contract {',
        '        Int256 counter = new Int256();',
        '',
        '        public void setCounter(Int256 value) {',
        '            counter.Set(value);',
        '        }',
        '',
        '        public Int256 getCounter() {',
        '            return counter;',
        '        }',
        '    }',
        '}'
    ].join('\n');
    
    test.equal(result, expected);
};
