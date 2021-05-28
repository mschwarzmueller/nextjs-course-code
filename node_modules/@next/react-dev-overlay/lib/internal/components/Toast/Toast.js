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
exports.Toast = function Toast(_a) {
    var onClick = _a.onClick, children = _a.children, className = _a.className;
    return (React.createElement("div", { "data-nextjs-toast": true, onClick: onClick, className: className },
        React.createElement("div", { "data-nextjs-toast-wrapper": true }, children)));
};
//# sourceMappingURL=Toast.js.map