define(function (require, exports, module) {
    "use strict";
    var LanguageManager = brackets.getModule("language/LanguageManager");
    
    LanguageManager.defineLanguage("ophis", {
        name: "Ophis 6502 Assembler",
        mode: "6502",
        fileExtensions: ["oph"],
        lineComment: [";"]
    });
});

CodeMirror.defineMode('6502', function() {
    function words(str) {
        var obj = {}, words = str.split(" ");
        for (var i = 0; i < words.length; i++) obj[words[i]] = true;
        return obj;
    }
    
    var directives = words(".outfile .advance .alias .byte .cbmfloat .checkpc .data .incbin .include .org .require .space .text .word .dword .wordbe .dwordbe .scope .scend .macro .macend .invoke");
    
    var opcodes = words("adc and asl bcc bcs beq bit bmi bne bpl brk bvc bvs clc cld cli clv cmp cpx cpy dec dex dey eor inc inx iny jmp jsr lda ldx ldy lsr nop ora pha php pla plp rol ror rti rts sbc sec sed sei sta stx sty tax tay tsx txa txs tya");
    
    var undocumented = words("slo rla sre rra sax lax dcp isb anc asr arr ane lxa sbx sha shs las shy shx");
    
    var registers = words("a x y");
    
    return {
        startState: function() {
            return {
                tokenize: null
            };
        },
        token: function(stream, state) {
            if (state.tokenize) {
                return state.tokenize(stream,state);
            }
            var cur, ch = stream.next();
            
            // Comment
            if (ch === ';') {
                stream.skipToEnd();
                return "comment";
            }
            
            // String
            if (ch === '"') {
                strem.eatWhile(/\w/);
                return "string";
            }
            
            // Numbers
            if (/\d/.test(ch)) {
                if (ch === "$") {
                    stream.eatWhile(/[0-9a-fA-F]/);
                    return "number";
                }
                if (ch === "%") {
                    stream.eatWhile(/[0-1]/);
                    return "number";
                }
                if (ch === "0") {
                    stream.eatWhile(/[0-7]/);
                    return "number";
                }
                stream.eatWhile(/\d/);
                return "number";
            }
            
            // Opcodes
            if (opcodes.propertyIsEnumerable(cur) || undocumented.propertyIsEnumerable(cur)) {
                stream.eatWhile(/\w/);
                return "keyword";
            }
            
            // Directives
            if (directives.propertyIsEnumerable(cur)) {
                stream.eatWhile(/\w/);
                return "tag";
            }
            
            // Registers
            if (registers.propertyIsEnumerable(cur)) {
                stream.eatWhile(/\w/);
                return "builtin";
            }
            return null;
        }
    };
});