"use strict";
exports.__esModule = true;
var stacktrace_parser_1 = require("stacktrace-parser");
var regexNextStatic = /\/_next(\/static\/.+)/g;
function parseStack(stack) {
    var frames = stacktrace_parser_1.parse(stack);
    return frames.map(function (frame) {
        var _a, _b;
        try {
            var url = new URL(frame.file);
            var res = regexNextStatic.exec(url.pathname);
            if (res) {
                var distDir = (_b = (_a = process.env.__NEXT_DIST_DIR) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, '/')) === null || _b === void 0 ? void 0 : _b.replace(/\/$/, '');
                if (distDir) {
                    frame.file = 'file://' + distDir.concat(res.pop());
                }
            }
        }
        catch (_c) { }
        return frame;
    });
}
exports.parseStack = parseStack;
//# sourceMappingURL=parseStack.js.map