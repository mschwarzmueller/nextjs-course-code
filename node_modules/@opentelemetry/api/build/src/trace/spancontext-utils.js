"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSpanContextValid = exports.isValidSpanId = exports.isValidTraceId = exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = void 0;
var trace_flags_1 = require("./trace_flags");
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
exports.INVALID_SPANID = '0000000000000000';
exports.INVALID_TRACEID = '00000000000000000000000000000000';
exports.INVALID_SPAN_CONTEXT = {
    traceId: exports.INVALID_TRACEID,
    spanId: exports.INVALID_SPANID,
    traceFlags: trace_flags_1.TraceFlags.NONE,
};
function isValidTraceId(traceId) {
    return VALID_TRACEID_REGEX.test(traceId) && traceId !== exports.INVALID_TRACEID;
}
exports.isValidTraceId = isValidTraceId;
function isValidSpanId(spanId) {
    return VALID_SPANID_REGEX.test(spanId) && spanId !== exports.INVALID_SPANID;
}
exports.isValidSpanId = isValidSpanId;
/**
 * Returns true if this {@link SpanContext} is valid.
 * @return true if this {@link SpanContext} is valid.
 */
function isSpanContextValid(spanContext) {
    return (isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId));
}
exports.isSpanContextValid = isSpanContextValid;
//# sourceMappingURL=spancontext-utils.js.map