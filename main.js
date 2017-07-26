define(function (require, exports, module) {
    "use strict";
    require('ophis');
    
    var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
    CodeMirror.defineMIME("application/ophis", {name: "ophis", scriptingModeSpec:"ophis"});
    
    // define NASM language
    var LanguageManager = brackets.getModule("language/LanguageManager");
    LanguageManager.defineLanguage("ophis", {
        name: "Ophis 6502 Assembler",
        mode: "ophis",
        fileExtensions: ["oph"]
    });
    
});