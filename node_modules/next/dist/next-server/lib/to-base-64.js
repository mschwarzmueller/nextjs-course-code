"use strict";exports.__esModule=true;exports.toBase64=toBase64;/**
 * Isomorphic base64 that works on the server and client
 */function toBase64(str){if(typeof window==='undefined'){return Buffer.from(str).toString('base64');}else{return window.btoa(str);}}
//# sourceMappingURL=to-base-64.js.map