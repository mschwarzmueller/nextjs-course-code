"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var React = __importStar(require("react"));
var react_dom_1 = require("react-dom");
exports.ShadowPortal = function Portal(_a) {
    var children = _a.children;
    var mountNode = React.useRef(null);
    var portalNode = React.useRef(null);
    var shadowNode = React.useRef(null);
    var _b = __read(React.useState(), 2), forceUpdate = _b[1];
    React.useLayoutEffect(function () {
        var ownerDocument = mountNode.current.ownerDocument;
        portalNode.current = ownerDocument.createElement('nextjs-portal');
        shadowNode.current = portalNode.current.attachShadow({ mode: 'open' });
        ownerDocument.body.appendChild(portalNode.current);
        forceUpdate({});
        return function () {
            if (portalNode.current && portalNode.current.ownerDocument) {
                portalNode.current.ownerDocument.body.removeChild(portalNode.current);
            }
        };
    }, []);
    return shadowNode.current ? (react_dom_1.createPortal(children, shadowNode.current)) : (React.createElement("span", { ref: mountNode }));
};
//# sourceMappingURL=ShadowPortal.js.map