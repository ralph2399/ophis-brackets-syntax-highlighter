define(function (require, exports, module) {
    "use strict";	
    require('./lib/ophis');

    var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");
    CodeMirror.defineMIME("application/x-nasm", {name: "nasm", scriptingModeSpec:"nasm"});

    // define NASM language
    var LanguageManager = brackets.getModule("language/LanguageManager");

    LanguageManager.defineLanguage("ophis", {
        name: "Ophis Asssembler",
        mode: "ophis",
        fileExtensions: ["oph"]
  });
});