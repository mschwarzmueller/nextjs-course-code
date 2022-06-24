"use strict";exports.__esModule=true;exports.ReactLoadablePlugin=void 0;var _webpack=require("next/dist/compiled/webpack/webpack");/**
COPYRIGHT (c) 2017-present James Kyle <me@thejameskyle.com>
 MIT License
 Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWAR
*/ // Implementation of this PR: https://github.com/jamiebuilds/react-loadable/pull/132
// Modified to strip out unneeded results for Next's specific use case
function getModulesIterable(compilation,chunk){if(_webpack.isWebpack5){return compilation.chunkGraph.getChunkModulesIterable(chunk);}return chunk.modulesIterable;}function getModuleId(compilation,module){if(_webpack.isWebpack5){return compilation.chunkGraph.getModuleId(module);}return module.id;}function buildManifest(_compiler,compilation){let manifest={};compilation.chunkGroups.forEach(chunkGroup=>{if(chunkGroup.isInitial()){return;}chunkGroup.origins.forEach(chunkGroupOrigin=>{const{request}=chunkGroupOrigin;chunkGroup.chunks.forEach(chunk=>{chunk.files.forEach(file=>{if(!((file.endsWith('.js')||file.endsWith('.css'))&&file.match(/^static\/(chunks|css)\//))){return;}for(const module of getModulesIterable(compilation,chunk)){let id=getModuleId(compilation,module);if(!manifest[request]){manifest[request]=[];}// Avoid duplicate files
if(manifest[request].some(item=>item.id===id&&item.file===file)){continue;}manifest[request].push({id,file});}});});});});manifest=Object.keys(manifest).sort()// eslint-disable-next-line no-sequences
.reduce((a,c)=>(a[c]=manifest[c],a),{});return manifest;}class ReactLoadablePlugin{constructor(opts){this.filename=void 0;this.filename=opts.filename;}createAssets(compiler,compilation,assets){const manifest=buildManifest(compiler,compilation);// @ts-ignore: TODO: remove when webpack 5 is stable
assets[this.filename]=new _webpack.sources.RawSource(JSON.stringify(manifest,null,2));return assets;}apply(compiler){if(_webpack.isWebpack5){compiler.hooks.make.tap('ReactLoadableManifest',compilation=>{// @ts-ignore TODO: Remove ignore when webpack 5 is stable
compilation.hooks.processAssets.tap({name:'ReactLoadableManifest',// @ts-ignore TODO: Remove ignore when webpack 5 is stable
stage:_webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS},assets=>{this.createAssets(compiler,compilation,assets);});});return;}compiler.hooks.emit.tap('ReactLoadableManifest',compilation=>{this.createAssets(compiler,compilation,compilation.assets);});}}exports.ReactLoadablePlugin=ReactLoadablePlugin;
//# sourceMappingURL=react-loadable-plugin.js.map