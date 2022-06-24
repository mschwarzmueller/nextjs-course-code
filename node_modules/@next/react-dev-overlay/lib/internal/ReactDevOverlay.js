"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var React = __importStar(require("react"));
var Bus = __importStar(require("./bus"));
var ShadowPortal_1 = require("./components/ShadowPortal");
var Errors_1 = require("./container/Errors");
var BuildError_1 = require("./container/BuildError");
var ErrorBoundary_1 = require("./ErrorBoundary");
var Base_1 = require("./styles/Base");
var ComponentStyles_1 = require("./styles/ComponentStyles");
var CssReset_1 = require("./styles/CssReset");
function reducer(state, ev) {
    switch (ev.type) {
        case Bus.TYPE_BUILD_OK: {
            return __assign(__assign({}, state), { buildError: null });
        }
        case Bus.TYPE_BUILD_ERROR: {
            return __assign(__assign({}, state), { buildError: ev.message });
        }
        case Bus.TYPE_REFFRESH: {
            return __assign(__assign({}, state), { buildError: null, errors: [] });
        }
        case Bus.TYPE_UNHANDLED_ERROR:
        case Bus.TYPE_UNHANDLED_REJECTION: {
            return __assign(__assign({}, state), { nextId: state.nextId + 1, errors: __spread(state.errors, [{ id: state.nextId, event: ev }]) });
        }
        default: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            var _1 = ev;
            return state;
        }
    }
}
var ReactDevOverlay = function ReactDevOverlay(_a) {
    var children = _a.children;
    var _b = __read(React.useReducer(reducer, { nextId: 1, buildError: null, errors: [] }), 2), state = _b[0], dispatch = _b[1];
    React.useEffect(function () {
        Bus.on(dispatch);
        return function () {
            Bus.off(dispatch);
        };
    }, [dispatch]);
    var onComponentError = React.useCallback(function (_error, _componentStack) {
        // TODO: special handling
    }, []);
    var hasBuildError = state.buildError != null;
    var hasRuntimeErrors = Boolean(state.errors.length);
    var isMounted = hasBuildError || hasRuntimeErrors;
    return (React.createElement(React.Fragment, null,
        React.createElement(ErrorBoundary_1.ErrorBoundary, { onError: onComponentError }, children !== null && children !== void 0 ? children : null),
        isMounted ? (React.createElement(ShadowPortal_1.ShadowPortal, null,
            React.createElement(CssReset_1.CssReset, null),
            React.createElement(Base_1.Base, null),
            React.createElement(ComponentStyles_1.ComponentStyles, null),
            hasBuildError ? (React.createElement(BuildError_1.BuildError, { message: state.buildError })) : hasRuntimeErrors ? (React.createElement(Errors_1.Errors, { errors: state.errors })) : undefined)) : undefined));
};
exports["default"] = ReactDevOverlay;
//# sourceMappingURL=ReactDevOverlay.js.map