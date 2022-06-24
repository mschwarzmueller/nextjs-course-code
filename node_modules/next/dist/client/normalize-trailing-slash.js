"use strict";exports.__esModule=true;exports.removePathTrailingSlash=removePathTrailingSlash;exports.normalizePathTrailingSlash=void 0;/**
 * Removes the trailing slash of a path if there is one. Preserves the root path `/`.
 */function removePathTrailingSlash(path){return path.endsWith('/')&&path!=='/'?path.slice(0,-1):path;}/**
 * Normalizes the trailing slash of a path according to the `trailingSlash` option
 * in `next.config.js`.
 */const normalizePathTrailingSlash=process.env.__NEXT_TRAILING_SLASH?path=>{if(/\.[^/]+\/?$/.test(path)){return removePathTrailingSlash(path);}else if(path.endsWith('/')){return path;}else{return path+'/';}}:removePathTrailingSlash;exports.normalizePathTrailingSlash=normalizePathTrailingSlash;
//# sourceMappingURL=normalize-trailing-slash.js.map