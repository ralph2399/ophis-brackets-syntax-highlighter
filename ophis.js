define(function (require, exports, module) {
	var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
    "use strict";
    
    CodeMirror.defineMode("nasm", function() {
        function words(str) {
            var obj = {}, words = str.split(" ");
            for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
            return obj;
        }
        
        var instructions = words("adc and asl bcc bcs beq bit bmi bne bpl brk bvc bvs clc cld cli clv cmp cpx cpy dec dex dey eor inc inx iny jmp jsr lda ldx ldy lsr nop ora pha php pla plp rol ror rti rts sbc sec sed sei sta stx sty tax tay tsx txa txs tya");
    
        var unofficial = words("slo rla sre rra sax lax dcp isb anc asr arr ane lxa sbx sha shs las shy shx");
    
        var directives = words(".outfile .advance .alias .byte .cbmfloat .charmap .checkpc .data .incbin .include .org .require .space .text .word .dword .wordbe .dwordbe .scope .scend .macro .macend .invoke");
        
        var registers = words("a x y");
        
        var lineComment = ";";
        
        return {

            startState: function() {
                return {
                    tokenize: null
                };
            },

            token: function(stream, state) {

            if (state.tokenize) {
                return state.tokenize(stream, state);
            }

            var cur, ch = stream.next();

            // comment
            if (ch === lineCommentStartSymbol) {
                stream.skipToEnd();
                return "comment";
            }

            // string
            if (ch === '"') {
                stream.eatWhile(/\w/);
                return "string";
            }

            // decimal, hexadecimal, octal and binary numbers
            if (/\d/.test(ch)) {
                if (ch === "$") {
                    stream.eatWhile(/[0-9a-fA-F]/);
                    return "number";
                }
                else if (ch === "0") {
                    stream.eatWhile(/[0-7]/);
                    return "number";
                }
                else if (ch === "%") {
                    stream.eatWhile(/[0-1]/);
                    return "number";
                }
                else {
                    stream.eatWhile(/\d/);
                    return "number";
                }
            }

            if (instructions.propertyIsEnumerable(cur)) {
                stream.eatWhile(/\w/);
                return "keyword";
            }
                
            if (unofficial.propertyIsEnumerable(cur)) {
                stream.eatWhile(/\w/);
                return "tag";
            }

            if (directives.propertyIsEnumerable(cur)) {
                stream.eatWhile(/\w/);
                return "keyword";
            }

            if (registers.propertyIsEnumerable(cur)) {
                stream.eatWhile(/\w/);
                return "builtin";
            }
        },

        lineComment: lineCommentStartSymbol
        };
    });
    CodeMirror.defineMIME("text/ophis", "ophis");
});