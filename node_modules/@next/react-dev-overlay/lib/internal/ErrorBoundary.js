"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { error: null };
        return _this;
    }
    ErrorBoundary.prototype.componentDidCatch = function (error, 
    // Loosely typed because it depends on the React version and was
    // accidentally excluded in some versions.
    errorInfo) {
        this.props.onError(error, (errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.componentStack) || null);
        this.setState({ error: error });
    };
    ErrorBoundary.prototype.render = function () {
        return this.state.error
            ? // The component has to be unmounted or else it would continue to error
                null
            : this.props.children;
    };
    return ErrorBoundary;
}(react_1["default"].PureComponent));
exports.ErrorBoundary = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map