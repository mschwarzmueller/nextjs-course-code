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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var anser_1 = __importDefault(require("anser"));
var React = __importStar(require("react"));
exports.Terminal = function Terminal(_a) {
    var content = _a.content;
    var decoded = React.useMemo(function () {
        return anser_1["default"].ansiToJson(content, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [content]);
    return (React.createElement("div", { "data-nextjs-terminal": true },
        React.createElement("pre", null, decoded.map(function (entry, index) { return (React.createElement("span", { key: "terminal-entry-" + index, style: __assign({ color: entry.fg ? "var(--color-" + entry.fg + ")" : undefined }, (entry.decoration === 'bold'
                ? { fontWeight: 800 }
                : entry.decoration === 'italic'
                    ? { fontStyle: 'italic' }
                    : undefined)) }, entry.content)); }))));
};
//# sourceMappingURL=Terminal.js.map