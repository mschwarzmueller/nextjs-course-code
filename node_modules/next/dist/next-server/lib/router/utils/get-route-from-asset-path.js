"use strict";exports.__esModule=true;exports.default=getRouteFromAssetPath;// Translate a pages asset path (relative from a common prefix) back into its logical route
// "asset path" being its javascript file, data file, prerendered html,...
function getRouteFromAssetPath(assetPath,ext=''){assetPath=assetPath.replace(/\\/g,'/');assetPath=ext&&assetPath.endsWith(ext)?assetPath.slice(0,-ext.length):assetPath;if(assetPath.startsWith('/index/')){assetPath=assetPath.slice(6);}else if(assetPath==='/index'){assetPath='/';}return assetPath;}
//# sourceMappingURL=get-route-from-asset-path.js.map