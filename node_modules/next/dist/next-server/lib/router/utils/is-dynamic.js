"use strict";exports.__esModule=true;exports.isDynamicRoute=isDynamicRoute;// Identify /[param]/ in route string
const TEST_ROUTE=/\/\[[^/]+?\](?=\/|$)/;function isDynamicRoute(route){return TEST_ROUTE.test(route);}
//# sourceMappingURL=is-dynamic.js.map