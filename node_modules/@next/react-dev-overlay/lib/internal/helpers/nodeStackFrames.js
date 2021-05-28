"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var stacktrace_parser_1 = require("stacktrace-parser");
function getFilesystemFrame(frame) {
    var f = __assign({}, frame);
    if (typeof f.file === 'string') {
        if (
        // Posix:
        f.file.startsWith('/') ||
            // Win32:
            /^[a-z]:\\/i.test(f.file) ||
            // Win32 UNC:
            f.file.startsWith('\\\\')) {
            f.file = "file://" + f.file;
        }
    }
    return f;
}
exports.getFilesystemFrame = getFilesystemFrame;
var symbolNodeError = Symbol('NextjsNodeError');
function isNodeError(error) {
    return symbolNodeError in error;
}
exports.isNodeError = isNodeError;
function getNodeError(error) {
    var n;
    try {
        throw new Error(error.message);
    }
    catch (e) {
        n = e;
    }
    n.name = error.name;
    try {
        n.stack = stacktrace_parser_1.parse(error.stack)
            .map(getFilesystemFrame)
            .map(function (f) {
            var str = "    at " + f.methodName;
            if (f.file) {
                var loc = f.file;
                if (f.lineNumber) {
                    loc += ":" + f.lineNumber;
                    if (f.column) {
                        loc += ":" + f.column;
                    }
                }
                str += " (" + loc + ")";
            }
            return str;
        })
            .join('\n');
    }
    catch (_a) {
        n.stack = error.stack;
    }
    Object.defineProperty(n, symbolNodeError, {
        writable: false,
        enumerable: false,
        configurable: false
    });
    return n;
}
exports.getNodeError = getNodeError;
//# sourceMappingURL=nodeStackFrames.js.map