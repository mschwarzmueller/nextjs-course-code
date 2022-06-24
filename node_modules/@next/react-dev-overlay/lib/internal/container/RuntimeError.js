"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var React = __importStar(require("react"));
var CodeFrame_1 = require("../components/CodeFrame");
var noop_template_1 = require("../helpers/noop-template");
var stack_frame_1 = require("../helpers/stack-frame");
var CallStackFrame = function CallStackFrame(_a) {
    // TODO: ability to expand resolved frames
    // TODO: render error or external indicator
    var frame = _a.frame;
    var _b;
    var f = (_b = frame.originalStackFrame) !== null && _b !== void 0 ? _b : frame.sourceStackFrame;
    var hasSource = Boolean(frame.originalCodeFrame);
    var open = React.useCallback(function () {
        var _a;
        if (!hasSource)
            return;
        var params = new URLSearchParams();
        for (var key in f) {
            params.append(key, ((_a = f[key]) !== null && _a !== void 0 ? _a : '').toString());
        }
        self
            .fetch((process.env.__NEXT_ROUTER_BASEPATH || '') + "/__nextjs_launch-editor?" + params.toString())
            .then(function () { }, function () {
            // TODO: report error
        });
    }, [hasSource, f]);
    return (React.createElement("div", { "data-nextjs-call-stack-frame": true },
        React.createElement("h6", { "data-nextjs-frame-expanded": Boolean(frame.expanded) }, f.methodName),
        React.createElement("div", { "data-has-source": hasSource ? 'true' : undefined, tabIndex: hasSource ? 10 : undefined, role: hasSource ? 'link' : undefined, onClick: open, title: hasSource ? 'Click to open in your editor' : undefined },
            React.createElement("span", null, stack_frame_1.getFrameSource(f)),
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
                React.createElement("polyline", { points: "15 3 21 3 21 9" }),
                React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" })))));
};
var RuntimeError = function RuntimeError(_a) {
    var error = _a.error;
    var firstFirstPartyFrameIndex = React.useMemo(function () {
        return error.frames.findIndex(function (entry) {
            return entry.expanded &&
                Boolean(entry.originalCodeFrame) &&
                Boolean(entry.originalStackFrame);
        });
    }, [error.frames]);
    var firstFrame = React.useMemo(function () {
        var _a;
        return (_a = error.frames[firstFirstPartyFrameIndex]) !== null && _a !== void 0 ? _a : null;
    }, [error.frames, firstFirstPartyFrameIndex]);
    var allLeadingFrames = React.useMemo(function () {
        return firstFirstPartyFrameIndex < 0
            ? []
            : error.frames.slice(0, firstFirstPartyFrameIndex);
    }, [error.frames, firstFirstPartyFrameIndex]);
    var _b = __read(React.useState(firstFrame == null), 2), all = _b[0], setAll = _b[1];
    var toggleAll = React.useCallback(function () {
        setAll(function (v) { return !v; });
    }, []);
    var leadingFrames = React.useMemo(function () { return allLeadingFrames.filter(function (f) { return f.expanded || all; }); }, [all, allLeadingFrames]);
    var allCallStackFrames = React.useMemo(function () { return error.frames.slice(firstFirstPartyFrameIndex + 1); }, [error.frames, firstFirstPartyFrameIndex]);
    var visibleCallStackFrames = React.useMemo(function () { return allCallStackFrames.filter(function (f) { return f.expanded || all; }); }, [all, allCallStackFrames]);
    var canShowMore = React.useMemo(function () {
        return (allCallStackFrames.length !== visibleCallStackFrames.length ||
            (all && firstFrame != null));
    }, [
        all,
        allCallStackFrames.length,
        firstFrame,
        visibleCallStackFrames.length,
    ]);
    return (React.createElement(React.Fragment, null,
        firstFrame ? (React.createElement(React.Fragment, null,
            React.createElement("h5", null, "Source"),
            leadingFrames.map(function (frame, index) { return (React.createElement(CallStackFrame, { key: "leading-frame-" + index + "-" + all, frame: frame })); }),
            React.createElement(CodeFrame_1.CodeFrame, { stackFrame: firstFrame.originalStackFrame, codeFrame: firstFrame.originalCodeFrame }))) : undefined,
        visibleCallStackFrames.length ? (React.createElement(React.Fragment, null,
            React.createElement("h5", null, "Call Stack"),
            visibleCallStackFrames.map(function (frame, index) { return (React.createElement(CallStackFrame, { key: "call-stack-" + index + "-" + all, frame: frame })); }))) : undefined,
        canShowMore ? (React.createElement(React.Fragment, null,
            React.createElement("button", { tabIndex: 10, "data-nextjs-data-runtime-error-collapsed-action": true, type: "button", onClick: toggleAll },
                all ? 'Hide' : 'Show',
                " collapsed frames"))) : undefined));
};
exports.RuntimeError = RuntimeError;
exports.styles = noop_template_1.noop(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  button[data-nextjs-data-runtime-error-collapsed-action] {\n    background: none;\n    border: none;\n    padding: 0;\n    font-size: var(--size-font-small);\n    line-height: var(--size-font-bigger);\n    color: var(--color-accents-3);\n  }\n\n  [data-nextjs-call-stack-frame]:not(:last-child) {\n    margin-bottom: var(--size-gap-double);\n  }\n\n  [data-nextjs-call-stack-frame] > h6 {\n    margin-top: 0;\n    margin-bottom: var(--size-gap);\n    font-family: var(--font-stack-monospace);\n    color: #222;\n  }\n  [data-nextjs-call-stack-frame] > h6[data-nextjs-frame-expanded='false'] {\n    color: #666;\n  }\n  [data-nextjs-call-stack-frame] > div {\n    display: flex;\n    align-items: center;\n    padding-left: calc(var(--size-gap) + var(--size-gap-half));\n    font-size: var(--size-font-small);\n    color: #999;\n  }\n  [data-nextjs-call-stack-frame] > div > svg {\n    width: auto;\n    height: var(--size-font-small);\n    margin-left: var(--size-gap);\n\n    display: none;\n  }\n\n  [data-nextjs-call-stack-frame] > div[data-has-source] {\n    cursor: pointer;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source]:hover {\n    text-decoration: underline dotted;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source] > svg {\n    display: unset;\n  }\n"], ["\n  button[data-nextjs-data-runtime-error-collapsed-action] {\n    background: none;\n    border: none;\n    padding: 0;\n    font-size: var(--size-font-small);\n    line-height: var(--size-font-bigger);\n    color: var(--color-accents-3);\n  }\n\n  [data-nextjs-call-stack-frame]:not(:last-child) {\n    margin-bottom: var(--size-gap-double);\n  }\n\n  [data-nextjs-call-stack-frame] > h6 {\n    margin-top: 0;\n    margin-bottom: var(--size-gap);\n    font-family: var(--font-stack-monospace);\n    color: #222;\n  }\n  [data-nextjs-call-stack-frame] > h6[data-nextjs-frame-expanded='false'] {\n    color: #666;\n  }\n  [data-nextjs-call-stack-frame] > div {\n    display: flex;\n    align-items: center;\n    padding-left: calc(var(--size-gap) + var(--size-gap-half));\n    font-size: var(--size-font-small);\n    color: #999;\n  }\n  [data-nextjs-call-stack-frame] > div > svg {\n    width: auto;\n    height: var(--size-font-small);\n    margin-left: var(--size-gap);\n\n    display: none;\n  }\n\n  [data-nextjs-call-stack-frame] > div[data-has-source] {\n    cursor: pointer;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source]:hover {\n    text-decoration: underline dotted;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source] > svg {\n    display: unset;\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=RuntimeError.js.map