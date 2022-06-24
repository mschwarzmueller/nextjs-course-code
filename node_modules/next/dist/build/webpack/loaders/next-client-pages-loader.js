"use strict";exports.__esModule=true;exports.default=void 0;var _loaderUtils=_interopRequireDefault(require("next/dist/compiled/loader-utils"));var _tracer=require("../../tracer");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// this parameter: https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters
function nextClientPagesLoader(){return _tracer.tracer.withSpan(this.currentTraceSpan,()=>{const span=_tracer.tracer.startSpan('next-client-pages-loader');return(0,_tracer.traceFn)(span,()=>{const{absolutePagePath,page}=_loaderUtils.default.getOptions(this);span.setAttribute('absolutePagePath',absolutePagePath);const stringifiedAbsolutePagePath=JSON.stringify(absolutePagePath);const stringifiedPage=JSON.stringify(page);return`
      (window.__NEXT_P = window.__NEXT_P || []).push([
        ${stringifiedPage},
        function () {
          return require(${stringifiedAbsolutePagePath});
        }
      ]);
    `;});});}var _default=nextClientPagesLoader;exports.default=_default;
//# sourceMappingURL=next-client-pages-loader.js.map