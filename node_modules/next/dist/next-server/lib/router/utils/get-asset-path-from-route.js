"use strict";exports.__esModule=true;exports.default=getAssetPathFromRoute;// Translates a logical route into its pages asset path (relative from a common prefix)
// "asset path" being its javascript file, data file, prerendered html,...
function getAssetPathFromRoute(route,ext=''){const path=route==='/'?'/index':/^\/index(\/|$)/.test(route)?`/index${route}`:`${route}`;return path+ext;}
//# sourceMappingURL=get-asset-path-from-route.js.map