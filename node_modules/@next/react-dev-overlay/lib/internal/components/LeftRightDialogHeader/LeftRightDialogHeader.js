"use strict";
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
var LeftRightDialogHeader = function LeftRightDialogHeader(_a) {
    var children = _a.children, className = _a.className, previous = _a.previous, next = _a.next, close = _a.close;
    var buttonLeft = React.useRef(null);
    var buttonRight = React.useRef(null);
    var buttonClose = React.useRef(null);
    var _b = __read(React.useState(null), 2), nav = _b[0], setNav = _b[1];
    var onNav = React.useCallback(function (el) {
        setNav(el);
    }, []);
    React.useEffect(function () {
        if (nav == null) {
            return;
        }
        var root = nav.getRootNode();
        var d = self.document;
        function handler(e) {
            if (e.key === 'ArrowLeft') {
                e.stopPropagation();
                if (buttonLeft.current) {
                    buttonLeft.current.focus();
                }
                previous && previous();
            }
            else if (e.key === 'ArrowRight') {
                e.stopPropagation();
                if (buttonRight.current) {
                    buttonRight.current.focus();
                }
                next && next();
            }
            else if (e.key === 'Escape') {
                e.stopPropagation();
                if (root instanceof ShadowRoot) {
                    var a = root.activeElement;
                    if (a && a !== buttonClose.current && a instanceof HTMLElement) {
                        a.blur();
                        return;
                    }
                }
                if (close) {
                    close();
                }
            }
        }
        root.addEventListener('keydown', handler);
        if (root !== d) {
            d.addEventListener('keydown', handler);
        }
        return function () {
            root.removeEventListener('keydown', handler);
            if (root !== d) {
                d.removeEventListener('keydown', handler);
            }
        };
    }, [close, nav, next, previous]);
    // Unlock focus for browsers like Firefox, that break all user focus if the
    // currently focused item becomes disabled.
    React.useEffect(function () {
        if (nav == null) {
            return;
        }
        var root = nav.getRootNode();
        // Always true, but we do this for TypeScript:
        if (root instanceof ShadowRoot) {
            var a = root.activeElement;
            if (previous == null) {
                if (buttonLeft.current && a === buttonLeft.current) {
                    buttonLeft.current.blur();
                }
            }
            else if (next == null) {
                if (buttonRight.current && a === buttonRight.current) {
                    buttonRight.current.blur();
                }
            }
        }
    }, [nav, next, previous]);
    return (React.createElement("div", { "data-nextjs-dialog-left-right": true, className: className },
        React.createElement("nav", { ref: onNav },
            React.createElement("button", { ref: buttonLeft, type: "button", disabled: previous == null ? true : undefined, "aria-disabled": previous == null ? true : undefined, onClick: previous !== null && previous !== void 0 ? previous : undefined },
                React.createElement("svg", { viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    React.createElement("path", { d: "M6.99996 1.16666L1.16663 6.99999L6.99996 12.8333M12.8333 6.99999H1.99996H12.8333Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))),
            React.createElement("button", { ref: buttonRight, type: "button", disabled: next == null ? true : undefined, "aria-disabled": next == null ? true : undefined, onClick: next !== null && next !== void 0 ? next : undefined },
                React.createElement("svg", { viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    React.createElement("path", { d: "M6.99996 1.16666L12.8333 6.99999L6.99996 12.8333M1.16663 6.99999H12H1.16663Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))),
            "\u00A0",
            children),
        close ? (React.createElement("button", { ref: buttonClose, type: "button", onClick: close, "aria-label": "Close" },
            React.createElement("span", { "aria-hidden": "true" },
                React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    React.createElement("path", { d: "M18 6L6 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
                    React.createElement("path", { d: "M6 6L18 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))))) : null));
};
exports.LeftRightDialogHeader = LeftRightDialogHeader;
//# sourceMappingURL=LeftRightDialogHeader.js.map