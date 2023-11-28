"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = transformSource;
var _swc = require("../../swc");
async function transformSource(source) {
    const { resourcePath  } = this;
    const ast = await (0, _swc).parse(source, {
        filename: resourcePath,
        isModule: "unknown"
    });
    const isModule = ast.type === "Module";
    return source + (isModule ? `
      export const __next_rsc__ = {
        __webpack_require__,
        server: true
      }
    ` : `
      exports.__next_rsc__ = {
        __webpack_require__,
        server: true
      }
    `);
}

//# sourceMappingURL=next-flight-server-loader.js.map