"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPagePaths = getPagePaths;
var _denormalizePagePath = require("./denormalize-page-path");
var _flatten = require("../flatten");
var _path = require("../isomorphic/path");
function getPagePaths(normalizedPagePath, extensions) {
    const page = (0, _denormalizePagePath).denormalizePagePath(normalizedPagePath);
    return (0, _flatten).flatten(extensions.map((extension)=>{
        return !normalizedPagePath.endsWith('/index') ? [
            `${page}.${extension}`,
            (0, _path).join(page, `index.${extension}`)
        ] : [
            (0, _path).join(page, `index.${extension}`)
        ];
    }));
}

//# sourceMappingURL=get-page-paths.js.map