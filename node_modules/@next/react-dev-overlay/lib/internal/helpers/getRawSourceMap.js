"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var data_uri_to_buffer_1 = __importDefault(require("data-uri-to-buffer"));
var getSourceMapUrl_1 = require("./getSourceMapUrl");
function getRawSourceMap(fileContents) {
    var sourceUrl = getSourceMapUrl_1.getSourceMapUrl(fileContents);
    if (!(sourceUrl === null || sourceUrl === void 0 ? void 0 : sourceUrl.startsWith('data:'))) {
        return null;
    }
    var buffer;
    try {
        buffer = data_uri_to_buffer_1["default"](sourceUrl);
    }
    catch (err) {
        console.error('Failed to parse source map URL:', err);
        return null;
    }
    if (buffer.type !== 'application/json') {
        console.error("Unknown source map type: " + buffer.typeFull + ".");
        return null;
    }
    try {
        return JSON.parse(buffer.toString());
    }
    catch (_a) {
        console.error('Failed to parse source map.');
        return null;
    }
}
exports.getRawSourceMap = getRawSourceMap;
//# sourceMappingURL=getRawSourceMap.js.map