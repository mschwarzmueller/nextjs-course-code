"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
function getOriginalStackFrames(isServerSide, frames) {
    return Promise.all(frames.map(function (frame) { return getOriginalStackFrame(isServerSide, frame); }));
}
exports.getOriginalStackFrames = getOriginalStackFrames;
function getOriginalStackFrame(isServerSide, source) {
    var _a, _b;
    function _getOriginalStackFrame() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var params, key, controller, tm, res, _e, _f, _g, body;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.append('isServerSide', String(isServerSide));
                        for (key in source) {
                            params.append(key, ((_a = source[key]) !== null && _a !== void 0 ? _a : '').toString());
                        }
                        controller = new AbortController();
                        tm = setTimeout(function () { return controller.abort(); }, 3000);
                        return [4 /*yield*/, self
                                .fetch((process.env.__NEXT_ROUTER_BASEPATH || '') + "/__nextjs_original-stack-frame?" + params.toString(), {
                                signal: controller.signal
                            })["finally"](function () {
                                clearTimeout(tm);
                            })];
                    case 1:
                        res = _h.sent();
                        if (!(!res.ok || res.status === 204)) return [3 /*break*/, 3];
                        _f = (_e = Promise).reject;
                        _g = Error.bind;
                        return [4 /*yield*/, res.text()];
                    case 2: return [2 /*return*/, _f.apply(_e, [new (_g.apply(Error, [void 0, _h.sent()]))()])];
                    case 3: return [4 /*yield*/, res.json()];
                    case 4:
                        body = _h.sent();
                        return [2 /*return*/, {
                                error: false,
                                reason: null,
                                external: false,
                                expanded: !Boolean((_d = (_c = (_b = 
                                /* collapsed */
                                body.originalStackFrame) === null || _b === void 0 ? void 0 : _b.file) === null || _c === void 0 ? void 0 : _c.includes('node_modules')) !== null && _d !== void 0 ? _d : true),
                                sourceStackFrame: source,
                                originalStackFrame: body.originalStackFrame,
                                originalCodeFrame: body.originalCodeFrame || null
                            }];
                }
            });
        });
    }
    if (!(((_a = source.file) === null || _a === void 0 ? void 0 : _a.startsWith('webpack-internal:')) || ((_b = source.file) === null || _b === void 0 ? void 0 : _b.startsWith('file:')))) {
        return Promise.resolve({
            error: false,
            reason: null,
            external: true,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        });
    }
    return _getOriginalStackFrame()["catch"](function (err) {
        var _a, _b;
        return ({
            error: true,
            reason: (_b = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err === null || err === void 0 ? void 0 : err.toString()) !== null && _b !== void 0 ? _b : 'Unknown Error',
            external: false,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        });
    });
}
exports.getOriginalStackFrame = getOriginalStackFrame;
function getFrameSource(frame) {
    var _a;
    var str = '';
    try {
        var u = new URL(frame.file);
        // Strip the origin for same-origin scripts.
        if (typeof globalThis !== 'undefined' &&
            ((_a = globalThis.location) === null || _a === void 0 ? void 0 : _a.origin) !== u.origin) {
            // URLs can be valid without an `origin`, so long as they have a
            // `protocol`. However, `origin` is preferred.
            if (u.origin === 'null') {
                str += u.protocol;
            }
            else {
                str += u.origin;
            }
        }
        // Strip query string information as it's typically too verbose to be
        // meaningful.
        str += u.pathname;
        str += ' ';
    }
    catch (_b) {
        str += (frame.file || '(unknown)') + ' ';
    }
    if (frame.lineNumber != null) {
        if (frame.column != null) {
            str += "(" + frame.lineNumber + ":" + frame.column + ") ";
        }
        else {
            str += "(" + frame.lineNumber + ") ";
        }
    }
    return str.slice(0, -1);
}
exports.getFrameSource = getFrameSource;
//# sourceMappingURL=stack-frame.js.map