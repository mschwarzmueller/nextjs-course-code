"use strict";exports.__esModule=true;exports.getCssModuleLoader=getCssModuleLoader;var _client=require("./client");var _fileResolve=require("./file-resolve");var _getCssModuleLocalIdent=require("./getCssModuleLocalIdent");function getCssModuleLoader(ctx,postCssPlugins,preProcessors=[]){const loaders=[];if(ctx.isClient){// Add appropriate development more or production mode style
// loader
loaders.push((0,_client.getClientStyleLoader)({isDevelopment:ctx.isDevelopment,assetPrefix:ctx.assetPrefix}));}// Resolve CSS `@import`s and `url()`s
loaders.push({loader:require.resolve('next/dist/compiled/css-loader'),options:{importLoaders:1+preProcessors.length,sourceMap:true,// Use CJS mode for backwards compatibility:
esModule:false,url:_fileResolve.cssFileResolve,import:(url,_,resourcePath)=>(0,_fileResolve.cssFileResolve)(url,resourcePath),modules:{// Do not transform class names (CJS mode backwards compatibility):
exportLocalsConvention:'asIs',// Server-side (Node.js) rendering support:
exportOnlyLocals:ctx.isServer,// Disallow global style exports so we can code-split CSS and
// not worry about loading order.
mode:'pure',// Generate a friendly production-ready name so it's
// reasonably understandable. The same name is used for
// development.
// TODO: Consider making production reduce this to a single
// character?
getLocalIdent:_getCssModuleLocalIdent.getCssModuleLocalIdent}}});// Compile CSS
loaders.push({loader:require.resolve('next/dist/compiled/postcss-loader'),options:{postcssOptions:{plugins:postCssPlugins,config:false},sourceMap:true}});loaders.push(// Webpack loaders run like a stack, so we need to reverse the natural
// order of preprocessors.
...preProcessors.slice().reverse());return loaders;}
//# sourceMappingURL=modules.js.map