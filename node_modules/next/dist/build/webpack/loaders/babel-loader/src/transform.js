"use strict";exports.__esModule=true;exports.default=_default;var _core=require("next/dist/compiled/babel/core");var _util=require("util");var _Error=_interopRequireDefault(require("./Error"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const transform=(0,_util.promisify)(_core.transform);async function _default(source,options){let result;try{result=await transform(source,options);}catch(err){throw err.message&&err.codeFrame?new _Error.default(err):err;}if(!result)return null;// We don't return the full result here because some entries are not
// really serializable. For a full list of properties see here:
// https://github.com/babel/babel/blob/main/packages/babel-core/src/transformation/index.js
// For discussion on this topic see here:
// https://github.com/babel/babel-loader/pull/629
const{ast,code,map,metadata,sourceType}=result;if(map&&(!map.sourcesContent||!map.sourcesContent.length)){map.sourcesContent=[source];}return{ast,code,map,metadata,sourceType};}
//# sourceMappingURL=transform.js.map