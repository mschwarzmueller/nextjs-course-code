"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useHeaders = useHeaders;
exports.usePreviewData = usePreviewData;
exports.useCookies = useCookies;
var _react = require("react");
var _hooksServerContext = require("./hooks-server-context");
function useHeaders() {
    return (0, _react).useContext(_hooksServerContext.HeadersContext);
}
function usePreviewData() {
    return (0, _react).useContext(_hooksServerContext.PreviewDataContext);
}
function useCookies() {
    return (0, _react).useContext(_hooksServerContext.CookiesContext);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=hooks-server.js.map