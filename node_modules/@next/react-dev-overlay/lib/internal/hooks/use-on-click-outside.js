"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var React = __importStar(require("react"));
function useOnClickOutside(el, handler) {
    React.useEffect(function () {
        if (el == null || handler == null) {
            return;
        }
        var listener = function (e) {
            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(e.target)) {
                return;
            }
            handler(e);
        };
        var root = el.getRootNode();
        root.addEventListener('mousedown', listener);
        root.addEventListener('touchstart', listener);
        return function () {
            root.removeEventListener('mousedown', listener);
            root.removeEventListener('touchstart', listener);
        };
    }, [handler, el]);
}
exports.useOnClickOutside = useOnClickOutside;
//# sourceMappingURL=use-on-click-outside.js.map