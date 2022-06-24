"use strict";
exports.__esModule = true;
function getSourceMapUrl(fileContents) {
    var regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
    var match = null;
    for (;;) {
        var next = regex.exec(fileContents);
        if (next == null) {
            break;
        }
        match = next;
    }
    if (!(match && match[1])) {
        return null;
    }
    return match[1].toString();
}
exports.getSourceMapUrl = getSourceMapUrl;
//# sourceMappingURL=getSourceMapUrl.js.map