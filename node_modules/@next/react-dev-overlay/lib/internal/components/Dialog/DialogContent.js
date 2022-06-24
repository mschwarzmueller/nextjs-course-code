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
var DialogContent = function DialogContent(_a) {
    var children = _a.children, className = _a.className;
    return (React.createElement("div", { "data-nextjs-dialog-content": true, className: className }, children));
};
exports.DialogContent = DialogContent;
//# sourceMappingURL=DialogContent.js.map