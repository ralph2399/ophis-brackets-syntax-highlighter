define(function (require, exports, module) {    
    "use strict";
    var LanguageManager = brackets.getModule("language/LanguageManager");
    
    LanguageManager.defineLanguage("ophis", {
        name: "Ophis 6502 Assembler",
        mode: "ophis",
        fileExtensions: ["oph"],
        lineComment: [";"]
    });
});

CodeMirror.defineMode('ophis', function() {
    var opcodes = /\b(a(dc|nd|sl)|b(cc|cs|eq|it|mi|ne|pl|rk|vc|vs)|c(lc|ld|li|lv|mp|px|py)|d(ec|ex|ey)|eor|i(nc|nx|ny)|j(mp|sr)|l(da|dx|dy|sr)|nop|ora|p(ha|hp|la|lp)|r(ol|or|ti|ts)|s(bc|ec|ed|ei|ta|tx|ty)|t(ax|ay|sx|xa|xs|ya))\b/i;
    
    var undocumented = /\b(a(sr|rr|ne)|s(lo|re|ax|bx|ha|hs|hy|hx)|r(la|ra)|l(ax|xa|as))\b/i;
    
    var directives = /\.(a(dvance|lias)|byte|c(bmfloat|heckpc|harmap)|d(ata|word|wordbe)|i(ncbin|nclude|nvoke)|m(acro|acend)|o(rg|utfile)|require|s(pace|cope|cend)|text|w(ord|ordbe))\b/i;
    
    var numbers = /\b($+[\da-f]|0+[0-7]|%+[0-1]|\d)\b/i;
    
    return {
        startState: function() {
            return {context: 0};
        },
        token: function(stream, state) {
            
            if (stream.eatSpace()) {
                return null;
            }
            
            var item;
            
            if (stream.eatWhile(/\w/)) {
                item = stream.current();
                
                if (numbers.test(item)) {
                    return 'number';
                }
                else if (opcodes.test(item)) {
                    return 'opcode';
                }
                else if (undocumented.test(item)) {
                    return 'unof_opcode';
                }
            }
            else if (stream.eat(';')) {
                stream.skipToEnd();
                return 'comment';
            }
            else if (stream.eat('"')) {
                while (item = stream.next()) {
                    if (item == '"') {
                        break;
                    }
                }
                return 'string';
            }
            else if (stream.eat('.')) {
                if (stream.eatWhile(/\w/)) {
                    item = stream.current();
                    if (directives.test(item)) {
                        return 'directive';
                    }
                    return null;
                }
            }
            else {
                stream.next();
            }
            return null;
        }
    };
});