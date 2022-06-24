"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var styles_1 = require("../components/CodeFrame/styles");
var Dialog_1 = require("../components/Dialog");
var styles_2 = require("../components/LeftRightDialogHeader/styles");
var styles_3 = require("../components/Overlay/styles");
var styles_4 = require("../components/Terminal/styles");
var Toast_1 = require("../components/Toast");
var BuildError_1 = require("../container/BuildError");
var Errors_1 = require("../container/Errors");
var RuntimeError_1 = require("../container/RuntimeError");
var noop_template_1 = require("../helpers/noop-template");
function ComponentStyles() {
    return (React.createElement("style", { dangerouslySetInnerHTML: {
            __html: noop_template_1.noop(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n\n          ", "\n          ", "\n          ", "\n        "], ["\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n\n          ", "\n          ", "\n          ", "\n        "])), styles_3.styles, Toast_1.styles, Dialog_1.styles, styles_2.styles, styles_1.styles, styles_4.styles, BuildError_1.styles, Errors_1.styles, RuntimeError_1.styles)
        } }));
}
exports.ComponentStyles = ComponentStyles;
var templateObject_1;
//# sourceMappingURL=ComponentStyles.js.map