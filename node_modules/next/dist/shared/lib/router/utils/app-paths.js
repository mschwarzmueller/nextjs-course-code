"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeAppPath = normalizeAppPath;
function normalizeAppPath(pathname) {
    let normalized = '';
    const segments = pathname.split('/');
    segments.forEach((segment, index)=>{
        if (!segment) return;
        if (segment.startsWith('(') && segment.endsWith(')')) {
            return;
        }
        if (segment === 'page' && index === segments.length - 1) {
            return;
        }
        normalized += `/${segment}`;
    });
    return normalized;
}

//# sourceMappingURL=app-paths.js.map