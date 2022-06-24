"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryTtl = void 0;
/**
 * EntryTtl is an integer that represents number of hops an entry can propagate.
 *
 * For now, ONLY special values (0 and -1) are supported.
 */
var EntryTtl;
(function (EntryTtl) {
    /**
     * NO_PROPAGATION is considered to have local context and is used within the
     * process it created.
     */
    EntryTtl[EntryTtl["NO_PROPAGATION"] = 0] = "NO_PROPAGATION";
    /** UNLIMITED_PROPAGATION can propagate unlimited hops. */
    EntryTtl[EntryTtl["UNLIMITED_PROPAGATION"] = -1] = "UNLIMITED_PROPAGATION";
})(EntryTtl = exports.EntryTtl || (exports.EntryTtl = {}));
//# sourceMappingURL=EntryValue.js.map