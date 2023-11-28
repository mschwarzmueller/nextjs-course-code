"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isNextBuiltinClientComponent = isNextBuiltinClientComponent;
exports.buildExports = buildExports;
exports.serverComponentRegex = exports.clientComponentRegex = exports.defaultJsFileExtensions = void 0;
const defaultJsFileExtensions = [
    "js",
    "mjs",
    "jsx",
    "ts",
    "tsx"
];
exports.defaultJsFileExtensions = defaultJsFileExtensions;
const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif"
];
const nextClientComponents = [
    "link",
    "image",
    // TODO-APP: check if this affects the regex
    "future/image",
    "head",
    "script",
    "dynamic", 
];
const NEXT_BUILT_IN_CLIENT_RSC_REGEX = new RegExp(`[\\\\/]next[\\\\/](${nextClientComponents.join("|")})\\.js$`);
function isNextBuiltinClientComponent(resourcePath) {
    return NEXT_BUILT_IN_CLIENT_RSC_REGEX.test(resourcePath);
}
function buildExports(moduleExports, isESM) {
    let ret = "";
    Object.keys(moduleExports).forEach((key)=>{
        const exportExpression = isESM ? `export ${key === "default" ? key : `const ${key} =`} ${moduleExports[key]}` : `exports.${key} = ${moduleExports[key]}`;
        ret += exportExpression + "\n";
    });
    return ret;
}
const clientComponentRegex = new RegExp("(" + `\\.client(\\.(${defaultJsFileExtensions.join("|")}))?|` + `next/(${nextClientComponents.join("|")})(\\.js)?|` + `\\.(${imageExtensions.join("|")})` + ")$");
exports.clientComponentRegex = clientComponentRegex;
const serverComponentRegex = new RegExp(`\\.server(\\.(${defaultJsFileExtensions.join("|")}))?$`);
exports.serverComponentRegex = serverComponentRegex;

//# sourceMappingURL=utils.js.map