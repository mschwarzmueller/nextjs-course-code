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
var strip_ansi_1 = __importDefault(require("strip-ansi"));
var stack_frame_1 = require("../../helpers/stack-frame");
exports.CodeFrame = function CodeFrame(_a) {
    var stackFrame = _a.stackFrame, codeFrame = _a.codeFrame;
    // Strip leading spaces out of the code frame:
    var formattedFrame = React.useMemo(function () {
        var lines = codeFrame.split(/\r?\n/g);
        var prefixLength = lines
            .map(function (line) { return /^>? +\d+ +\| ( *)/.exec(strip_ansi_1["default"](line)); })
            .filter(Boolean)
            .map(function (v) { return v.pop(); })
            .reduce(function (c, n) { return (isNaN(c) ? n.length : Math.min(c, n.length)); }, NaN);
        if (prefixLength > 1) {
            var p_1 = ' '.repeat(prefixLength);
            return lines
                .map(function (line, a) {
                return ~(a = line.indexOf('|'))
                    ? line.substring(0, a) + line.substring(a).replace(p_1, '')
                    : line;
            })
                .join('\n');
        }
        return lines.join('\n');
    }, [codeFrame]);
    var decoded = React.useMemo(function () {
        return anser_1["default"].ansiToJson(formattedFrame, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [formattedFrame]);
    var open = React.useCallback(function () {
        var _a;
        var params = new URLSearchParams();
        for (var key in stackFrame) {
            params.append(key, ((_a = stackFrame[key]) !== null && _a !== void 0 ? _a : '').toString());
        }
        self
            .fetch((process.env.__NEXT_ROUTER_BASEPATH || '') + "/__nextjs_launch-editor?" + params.toString())
            .then(function () { }, function () {
            // TODO: report error
        });
    }, [stackFrame]);
    // TODO: make the caret absolute
    return (React.createElement("div", { "data-nextjs-codeframe": true },
        React.createElement("p", { role: "link", onClick: open, tabIndex: 1, title: "Click to open in your editor" },
            React.createElement("span", null,
                stack_frame_1.getFrameSource(stackFrame),
                " @ ",
                stackFrame.methodName),
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
                React.createElement("polyline", { points: "15 3 21 3 21 9" }),
                React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" }))),
        React.createElement("hr", null),
        React.createElement("pre", null, decoded.map(function (entry, index) { return (React.createElement("span", { key: "frame-" + index, style: __assign({ color: entry.fg ? "var(--color-" + entry.fg + ")" : undefined }, (entry.decoration === 'bold'
                ? { fontWeight: 800 }
                : entry.decoration === 'italic'
                    ? { fontStyle: 'italic' }
                    : undefined)) }, entry.content)); }))));
};
//# sourceMappingURL=CodeFrame.js.map