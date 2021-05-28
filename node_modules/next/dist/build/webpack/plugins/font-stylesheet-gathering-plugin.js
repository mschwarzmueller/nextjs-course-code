"use strict";exports.__esModule=true;exports.FontStylesheetGatheringPlugin=void 0;var _webpack=require("next/dist/compiled/webpack/webpack");var _fontUtils=require("../../../next-server/server/font-utils");var _postcss=_interopRequireDefault(require("postcss"));var _cssnanoSimple=_interopRequireDefault(require("cssnano-simple"));var _constants=require("../../../next-server/lib/constants");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}async function minifyCss(css){return new Promise(resolve=>(0,_postcss.default)([(0,_cssnanoSimple.default)({excludeAll:true,discardComments:true,normalizeWhitespace:{exclude:false}})]).process(css,{from:undefined}).then(res=>{resolve(res.css);}));}class FontStylesheetGatheringPlugin{constructor(){this.compiler=void 0;this.gatheredStylesheets=[];this.manifestContent=[];this.parserHandler=factory=>{const JS_TYPES=['auto','esm','dynamic'];// Do an extra walk per module and add interested visitors to the walk.
for(const type of JS_TYPES){factory.hooks.parser.for('javascript/'+type).tap(this.constructor.name,parser=>{/**
           * Webpack fun facts:
           * `parser.hooks.call.for` cannot catch calls for user defined identifiers like `__jsx`
           * it can only detect calls for native objects like `window`, `this`, `eval` etc.
           * In order to be able to catch calls of variables like `__jsx`, first we need to catch them as
           * Identifier and then return `BasicEvaluatedExpression` whose `id` and `type` webpack matches to
           * invoke hook for call.
           * See: https://github.com/webpack/webpack/blob/webpack-4/lib/Parser.js#L1931-L1932.
           */parser.hooks.evaluate.for('Identifier').tap(this.constructor.name,node=>{var _parser$state,_parser$state$module;// We will only optimize fonts from first party code.
if(parser!=null&&(_parser$state=parser.state)!=null&&(_parser$state$module=_parser$state.module)!=null&&_parser$state$module.resource.includes('node_modules')){return;}let result;if(node.name==='_jsx'||node.name==='__jsx'){result=new _webpack.BasicEvaluatedExpression();// @ts-ignore
result.setRange(node.range);result.setExpression(node);result.setIdentifier(node.name);// This was added webpack 5.
if(_webpack.isWebpack5){result.getMembers=()=>[];}}return result;});const jsxNodeHandler=node=>{if(node.arguments.length!==2){// A font link tag has only two arguments rel=stylesheet and href='...'
return;}if(!isNodeCreatingLinkElement(node)){return;}// node.arguments[0] is the name of the tag and [1] are the props.
const propsNode=node.arguments[1];const props={};propsNode.properties.forEach(prop=>{if(prop.type!=='Property'){return;}if(prop.key.type==='Identifier'&&prop.value.type==='Literal'){props[prop.key.name]=prop.value.value;}});if(!props.rel||props.rel!=='stylesheet'||!props.href||!_constants.OPTIMIZED_FONT_PROVIDERS.some(url=>props.href.startsWith(url))){return false;}this.gatheredStylesheets.push(props.href);};// React JSX transform:
parser.hooks.call.for('_jsx').tap(this.constructor.name,jsxNodeHandler);// Next.js JSX transform:
parser.hooks.call.for('__jsx').tap(this.constructor.name,jsxNodeHandler);// New React JSX transform:
parser.hooks.call.for('imported var').tap(this.constructor.name,jsxNodeHandler);});}};}apply(compiler){this.compiler=compiler;compiler.hooks.normalModuleFactory.tap(this.constructor.name,this.parserHandler);compiler.hooks.make.tapAsync(this.constructor.name,(compilation,cb)=>{// @ts-ignore
if(compilation.options.output.path.endsWith('serverless')){/**
         * Inline font manifest for serverless case only.
         * For target: server drive the manifest through physical file and less of webpack magic.
         */const mainTemplate=compilation.mainTemplate;mainTemplate.hooks.requireExtensions.tap(this.constructor.name,source=>{return`${source}
                // Font manifest declaration
                ${_webpack.isWebpack5?'__webpack_require__':mainTemplate.requireFn}.__NEXT_FONT_MANIFEST__ = ${JSON.stringify(this.manifestContent)};
            // Enable feature:
            process.env.__NEXT_OPTIMIZE_FONTS = JSON.stringify(true);`;});}compilation.hooks.finishModules.tapAsync(this.constructor.name,async(_,modulesFinished)=>{const fontDefinitionPromises=this.gatheredStylesheets.map(url=>(0,_fontUtils.getFontDefinitionFromNetwork)(url));this.manifestContent=[];for(let promiseIndex in fontDefinitionPromises){const css=await fontDefinitionPromises[promiseIndex];const content=await minifyCss(css);this.manifestContent.push({url:this.gatheredStylesheets[promiseIndex],content});}if(!_webpack.isWebpack5){compilation.assets[_constants.FONT_MANIFEST]=new _webpack.sources.RawSource(JSON.stringify(this.manifestContent,null,'  '));}modulesFinished();});cb();});if(_webpack.isWebpack5){compiler.hooks.make.tap(this.constructor.name,compilation=>{// @ts-ignore TODO: Remove ignore when webpack 5 is stable
compilation.hooks.processAssets.tap({name:this.constructor.name,// @ts-ignore TODO: Remove ignore when webpack 5 is stable
stage:_webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS},assets=>{assets[_constants.FONT_MANIFEST]=new _webpack.sources.RawSource(JSON.stringify(this.manifestContent,null,'  '));});});}}}exports.FontStylesheetGatheringPlugin=FontStylesheetGatheringPlugin;function isNodeCreatingLinkElement(node){const callee=node.callee;if(callee.type!=='Identifier'){return false;}const componentNode=node.arguments[0];if(componentNode.type!=='Literal'){return false;}// React has pragma: _jsx.
// Next has pragma: __jsx.
return(callee.name==='_jsx'||callee.name==='__jsx')&&componentNode.value==='link';}
//# sourceMappingURL=font-stylesheet-gathering-plugin.js.map