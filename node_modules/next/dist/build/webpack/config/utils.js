"use strict";exports.__esModule=true;exports.pipe=void 0;const pipe=(...fns)=>param=>fns.reduce(async(result,next)=>next(await result),param);exports.pipe=pipe;
//# sourceMappingURL=utils.js.map