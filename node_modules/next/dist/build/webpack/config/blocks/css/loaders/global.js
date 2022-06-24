"use strict";exports.__esModule=true;exports.getGlobalCssLoader=getGlobalCssLoader;var _client=require("./client");var _fileResolve=require("./file-resolve");function getGlobalCssLoader(ctx,postCssPlugins,preProcessors=[]){const loaders=[];if(ctx.isClient){// Add appropriate development more or production mode style
// loader
loaders.push((0,_client.getClientStyleLoader)({isDevelopment:ctx.isDevelopment,assetPrefix:ctx.assetPrefix}));}// Resolve CSS `@import`s and `url()`s
loaders.push({loader:require.resolve('next/dist/compiled/css-loader'),options:{importLoaders:1+preProcessors.length,sourceMap:true,// Next.js controls CSS Modules eligibility:
modules:false,url:_fileResolve.cssFileResolve,import:(url,_,resourcePath)=>(0,_fileResolve.cssFileResolve)(url,resourcePath)}});// Compile CSS
loaders.push({loader:require.resolve('next/dist/compiled/postcss-loader'),options:{postcssOptions:{plugins:postCssPlugins,config:false},sourceMap:true}});loaders.push(// Webpack loaders run like a stack, so we need to reverse the natural
// order of preprocessors.
...preProcessors.slice().reverse());return loaders;}
//# sourceMappingURL=global.js.map