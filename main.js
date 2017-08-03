define(function (require, exports, module) {
    "use strict";
    
    CodeMirror.defineMode("ophis", function() {
        function getWords(str) {
            var obj = {}, words = str.split(" ");
            for (var i = 0; i < words.length; i++) obj[words[i]] = true;
            return obj;
        }
        // Official instructions
        var official_ops = getWords("adc and asl bcc bcs beq bit bmi bne bpl brk bvc bvs clc cld cli clv cmp cpx cpy dec dex dey eor inc inx iny jmp jsr lda ldx ldy lsr nop ora pha php pla plp rol ror rti rts sbc sec sed sei sta stx sty tax tay tsx txa txs tya");
        
        // Unofficial instructions
        var unofficial_ops = getWords("slo rla sre rra sax lax dcp isb anc asr arr ane lxa sbx sha shs las shy shx");
        
        // Assembler directives
        var directives = getWords(".outfile .advance .alias .byte .cbmfloat .charmap .checkpc .data .incbin .include .org .require .space .text .word .dword .wordbe .dwordbe .scope .scend .macro .macend .invoke");
        
        // Line comment
        var lineCommentSymbol = ";";
        
        return {
            startState: function () {
                return {
                    tokenize: null
                };
            },
            
            token: function (stream, state) {
                if (state.tokenize) {
                    return state.tokenize(stream, state);
                }
                
                var curChar, curStream = stream.next();
                
                // Line comment
                if (curChar == lineCommentSymbol) {
                    stream.skipToEnd();
                    return "comment";
                }
                
                // Strings
                if (curChar == '"') {
                    stream.skipTo('"');
                    return "string";
                }
                
                // Numbers (hex, octal, binary, decimal)
                if (/\d/.test(curChar)) {
                    if (curChar == "0" && curChar == "F") {
                        stream.eatWhile(/[0-9a-fA-F]/);
                        return "number";
                    }
                    if (curChar == "0" && curChar == "7") {
                        stream.eatWhile(/[0-7]/);
                        return "number";
                    }
                    if (curChar == "0" && curChar == "1") {
                        stream.eatWhile(/[0-1]/);
                        return "number";
                    }
                    stream.eatWhile(/\d/);
                    return "number";
                }
                
                // Directives
                if (curChar == ".") {
                    stream.eatWhile(/\w/);
                    curStream = stream.current().toLowerCase();
                    if (directives.propertyIsEnumerable(curStream)) return "builtin";
                } else {
                    curStream = stream.current().toLowerCase();
                }
                
                // Official instructions
                if (official_ops.propertyIsEnumerable(curStream)) {
                    stream.eatWhile(/\w/);
                    return "keyword";
                }
                
                // Unofficial instructions
                if (unofficial_ops.propertyIsEnumerable(curStream)) {
                    stream.eatWhile(/\w/);
                    return "tag";
                }
            },
            lineComment: lineCommentSymbol
        };
    });
   
    var LangaugeManager = brackets.getModule("language/LanguageManager");
    LanguageManager.defineLanguage("ophis", {
        name: "Ophis Assembler",
        mode: "ophis",
        fileExtensions: ["oph"]
    });
});
