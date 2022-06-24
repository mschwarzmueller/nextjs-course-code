"use strict";exports.__esModule=true;exports.DuplicatePolyfillsConformanceCheck=void 0;var _constants=require("../constants");var _TestInterface=require("../TestInterface");var _astUtils=require("../utils/ast-utils");var _fileUtils=require("../utils/file-utils");// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
function getMessage(property,request,isWarning=false){if(isWarning){return`${_constants.CONFORMANCE_WARNING_PREFIX}: Found a ${property} polyfill in ${(0,_fileUtils.getLocalFileName)(request)}.`;}return`${_constants.CONFORMANCE_ERROR_PREFIX}: Found a ${property} polyfill in ${(0,_fileUtils.getLocalFileName)(request)}.`;}const BANNED_LEFT_OBJECT_TYPES=['Identifier','ThisExpression'];class DuplicatePolyfillsConformanceCheck{constructor(options={}){this.BlockedAPIs=[];this.BlockedAPIs=options.BlockedAPIToBePolyfilled||[];}getAstNode(){const EARLY_EXIT_SUCCESS_RESULT={result:_TestInterface.IConformanceTestStatus.SUCCESS};return[{visitor:'visitAssignmentExpression',inspectNode:(path,{request})=>{const{node}=path;const left=node.left;/**
           * We're only interested in code like `foo.fetch = bar;`.
           * For anything else we exit with a success.
           * Also foo in foo.bar needs to be either Identifier or `this` and not someFunction().fetch;
           */if(left.type!=='MemberExpression'||!BANNED_LEFT_OBJECT_TYPES.includes(left.object.type)||left.property.type!=='Identifier'){return EARLY_EXIT_SUCCESS_RESULT;}if(!this.BlockedAPIs.includes(left.property.name)){return EARLY_EXIT_SUCCESS_RESULT;}/**
           * Here we know the code is `foo.(fetch/URL) = something.
           * If foo === this/self, fail it immediately.
           * check for this.[fetch|URL(...BlockedAPIs)]/ self.[fetch|URL(...BlockedAPIs)]
           **/if(isNodeThisOrSelf(left.object)){return{result:_TestInterface.IConformanceTestStatus.FAILED,warnings:[{message:getMessage(left.property.name,request)}]};}/**
           * we now are sure the code under examination is
           * `globalVar.[fetch|URL(...BlockedAPIs)] = something`
           **/const objectName=left.object.name;const allBindings=path.scope.lookup(objectName);if(!allBindings){/**
             * we have absolutely no idea where globalVar came from,
             * so lets just exit
             **/return EARLY_EXIT_SUCCESS_RESULT;}try{const sourcePath=allBindings.bindings[objectName][0];const originPath=sourcePath.parentPath;const{node:originNode}=originPath;if(originNode.type==='VariableDeclarator'&&isNodeThisOrSelf(originNode.init)){return{result:_TestInterface.IConformanceTestStatus.FAILED,warnings:[{message:getMessage(left.property.name,request)}]};}if(originPath.name==='params'&&originPath.parentPath.firstInStatement()){/**
               * We do not know what will be the value of this param at runtime so we just throw a warning.
               * ```
               * (function(scope){
               *  ....
               *  scope.fetch = new Fetch();
               * })(.....)
               * ```
               */return{result:_TestInterface.IConformanceTestStatus.FAILED,warnings:[{message:getMessage(left.property.name,request,true)}]};}}catch(e){return EARLY_EXIT_SUCCESS_RESULT;}return EARLY_EXIT_SUCCESS_RESULT;}},{visitor:'visitCallExpression',inspectNode:path=>{const{node}=path;if(!node.arguments||node.arguments.length<2){return EARLY_EXIT_SUCCESS_RESULT;}if((0,_astUtils.isNodeCreatingScriptElement)(node)){const propsNode=node.arguments[1];if(!propsNode.properties){return EARLY_EXIT_SUCCESS_RESULT;}const props=(0,_astUtils.reducePropsToObject)(propsNode);if(!('src'in props)){return EARLY_EXIT_SUCCESS_RESULT;}const foundBannedPolyfill=doesScriptLoadBannedAPIfromPolyfillIO(props.src,this.BlockedAPIs);if(foundBannedPolyfill){return{result:_TestInterface.IConformanceTestStatus.FAILED,warnings:[{message:`${_constants.CONFORMANCE_WARNING_PREFIX}: Found polyfill.io loading polyfill for ${foundBannedPolyfill}.`}]};}}return EARLY_EXIT_SUCCESS_RESULT;}}];}}exports.DuplicatePolyfillsConformanceCheck=DuplicatePolyfillsConformanceCheck;function isNodeThisOrSelf(node){return node.type==='ThisExpression'||node.type==='Identifier'&&node.name==='self';}function doesScriptLoadBannedAPIfromPolyfillIO(source,blockedAPIs){const url=new URL(source);if(url.hostname==='polyfill.io'&&url.searchParams.has('features')){const requestedAPIs=(url.searchParams.get('features')||'').split(',');return blockedAPIs.find(api=>requestedAPIs.includes(api));}}
//# sourceMappingURL=duplicate-polyfills-conformance-check.js.map