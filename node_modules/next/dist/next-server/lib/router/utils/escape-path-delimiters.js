"use strict";exports.__esModule=true;exports.default=escapePathDelimiters;// escape delimiters used by path-to-regexp
function escapePathDelimiters(segment,escapeEncoded){return segment.replace(new RegExp(`([/#?]${escapeEncoded?'|%(2f|23|3f)':''})`,'gi'),char=>encodeURIComponent(char));}
//# sourceMappingURL=escape-path-delimiters.js.map