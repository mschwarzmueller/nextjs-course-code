"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.displayContent = displayContent;
// This wrapper function is used to avoid raising a Trusted Types violation.
const safeSetTimeout = (callback)=>setTimeout(callback);
function displayContent() {
    return new Promise((resolve)=>{
        (window.requestAnimationFrame || safeSetTimeout)(function() {
            for(var x = document.querySelectorAll('[data-next-hide-fouc]'), i = x.length; i--;){
                x[i].parentNode.removeChild(x[i]);
            }
            resolve();
        });
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=fouc.js.map