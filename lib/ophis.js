// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
define(function (require, exports, module) {
    var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
    "use strict";
    
    CodeMirror.defineMode("ophis", function() {
        // Split up a string into an array of words.
        function splitWords(str) {
            var obj = {}, words = str.split(" ");
            for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
            return obj;
        }
        
        // The official 6502 and 65C02 instructions.
        var opcodes = splitWords("adc and asl bbr bbs bcc bcs beq bit bmi bne bpl bra brk bvc bvs clc cld cli clv cmp cpx cpy dec dex dey eor inc inx iny jmp jsr lda ldx ldy lsr nop ora pha php phx phy pla plp plx ply rmb rol ror rti rts sbc sec sed sei smb sta stp stx sty stz tax tay trb tsb tsx txa txs tya wai");
        
        // The unofficial 6502 instructions as seen in 64doc.txt
        var unofficialOpcodes = splitWords("slo rla sre rra sax lax dcp isb anc asr arr ane lxa sbx sha shs las shy shx");
        
        // The directives of the Ophis Assembler with the 6502/65C02 registers.
        var directives = splitWords(".outfile .advance .alias .byte .cbmfloat .charmap .checkpc .data .incbin .include .org .require .space .text .word .dword .wordbe .dwordbe .scope .scend .macro .macend .invoke");
        
        // The 6502/65C02 registers.
        // var registers = splitWords("a x y")
        
        // Line comment style
        var lineCommentStartSymbol = ";";
        
        // Interface
        return {
            startState: function () {
                return {
                    tokenize: null
                };
            },
            
            token: function(stream, state) {
                if (state.tokenize) {
                    return state.tokenize(stream, state);
                }
                
                var cur, ch = stream.next();
                
                // Comments.
                if (ch == lineCommentStartSymbol) {
                    stream.skipToEnd();
                    return "comment";
                }
                
                // Strings.
                if (ch == '"') {
                    stream.eatWhile(/[\w. ]/);
                    return "string";
                }
                
                // Numbers
                /*if (/\d/.test(ch)) {
                    if (ch == "$") {
                        stream.eatWhile(/[A-Fa-f]/);
                        return "number";
                    }
                    if (ch == "%") {
                        stream.eatWhile(/[0-1]/);
                        return "number";
                    }
                    if (ch == "0") {
                        stream.eatWhile(/[0-7]/);
                        return "number";
                    }
                    return "number";
                }*/
                
                // Hexadecimal numbers.
                if (ch == "$") {
                    stream.eatWhile(/[0-9A-Fa-f]/);
                    return "number";
                }
                
                // Binary numbers.
                if (ch == "%") {
                    stream.eatWhile(/[01]/);
                    return "number";
                }
                
                // Octal numbers.
                if (ch == "0") {
                    stream.eatWhile(/[0-7]/);
                    return "number";
                }
                
                // Decimal numbers.
                if (/\d/.test(ch)) {
                    return "number";
                }
                
                // Convert to lower case the current stream.
                if (/[\w.]/.test(ch)) {
                    stream.eatWhile(/[\w.]/);
                    cur = stream.current().toLowerCase();
                    if (directives.propertyIsEnumerable(cur)) return "def";
                }
                
                // Official opcodes.
                if (opcodes.propertyIsEnumerable(cur)) {
                    stream.eatWhile(/\w/);
                    return "keyword";
                }
                
                // Unofficial opcodes.
                if (unofficialOpcodes.propertyIsEnumerable(cur)) {
                    stream.eatWhile(/\w/);
                    return "error";
                }
                
                // Registers.
                /* if (registers.propertyIsEnumerable(cur)) {
                    stream.eatWhile(/\w/);
                    return "builtin";
                } */
                
            },
            lineComment: lineCommentStartSymbol
        };
    });
    CodeMirror.defineMIME("text/ophis", "ophis");
});
