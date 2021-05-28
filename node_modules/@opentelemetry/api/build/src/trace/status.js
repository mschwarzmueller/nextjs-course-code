"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
/**
 * An enumeration of status codes.
 */
var StatusCode;
(function (StatusCode) {
    /**
     * The operation has been validated by an Application developer or
     * Operator to have completed successfully.
     */
    StatusCode[StatusCode["OK"] = 0] = "OK";
    /**
     * The default status.
     */
    StatusCode[StatusCode["UNSET"] = 1] = "UNSET";
    /**
     * The operation contains an error.
     */
    StatusCode[StatusCode["ERROR"] = 2] = "ERROR";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
//# sourceMappingURL=status.js.map