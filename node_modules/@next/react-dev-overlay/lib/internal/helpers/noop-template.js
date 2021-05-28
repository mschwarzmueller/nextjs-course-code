"use strict";
exports.__esModule = true;
function noop(strings) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    var lastIndex = strings.length - 1;
    return (strings.slice(0, lastIndex).reduce(function (p, s, i) { return p + s + keys[i]; }, '') +
        strings[lastIndex]);
}
exports.noop = noop;
//# sourceMappingURL=noop-template.js.map