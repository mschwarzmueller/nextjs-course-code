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
exports.TYPE_BUILD_OK = 'build-ok';
exports.TYPE_BUILD_ERROR = 'build-error';
exports.TYPE_REFFRESH = 'fast-refresh';
exports.TYPE_UNHANDLED_ERROR = 'unhandled-error';
exports.TYPE_UNHANDLED_REJECTION = 'unhandled-rejection';
var handlers = new Set();
var queue = [];
function drain() {
    // Draining should never happen synchronously in case multiple handlers are
    // registered.
    setTimeout(function () {
        var _loop_1 = function () {
            var ev = queue.shift();
            handlers.forEach(function (handler) { return handler(ev); });
        };
        while (
        // Until we are out of events:
        Boolean(queue.length) &&
            // Or, if all handlers removed themselves as a result of handling the
            // event(s)
            Boolean(handlers.size)) {
            _loop_1();
        }
    }, 1);
}
function emit(ev) {
    queue.push(Object.freeze(__assign({}, ev)));
    drain();
}
exports.emit = emit;
function on(fn) {
    if (handlers.has(fn)) {
        return false;
    }
    handlers.add(fn);
    drain();
    return true;
}
exports.on = on;
function off(fn) {
    if (handlers.has(fn)) {
        handlers["delete"](fn);
        return true;
    }
    return false;
}
exports.off = off;
//# sourceMappingURL=bus.js.map