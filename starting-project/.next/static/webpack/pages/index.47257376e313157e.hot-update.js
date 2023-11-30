"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./components/events/event-item.js":
/*!*****************************************!*\
  !*** ./components/events/event-item.js ***!
  \*****************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ui_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/button */ \"./components/ui/button.js\");\n/* harmony import */ var _event_item_module_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./event-item.module.css */ \"./components/events/event-item.module.css\");\n/* harmony import */ var _event_item_module_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_event_item_module_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _icons_date_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../icons/date-icon */ \"./components/icons/date-icon.js\");\n/* harmony import */ var _icons_address_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../icons/address-icon */ \"./components/icons/address-icon.js\");\n/* harmony import */ var _icons_arrow_right_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../icons/arrow-right-icon */ \"./components/icons/arrow-right-icon.js\");\n\n\n\n\n\n\nfunction EventItem(props) {\n    const { title, image, date, location, id } = props;\n    const humanReadableDate = new Date(date).toLocaleDateString(\"en-US\", {\n        day: \"numeric\",\n        month: \"long\",\n        year: \"numeric\"\n    });\n    console.log(\"image\", image);\n    const formattedAddress = location.replace(\", \", \"\\n\");\n    const exploreLink = \"/events/\".concat(id);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n        className: (_event_item_module_css__WEBPACK_IMPORTED_MODULE_5___default().item),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                src: \"/\" + image,\n                alt: title\n            }, void 0, false, {\n                fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                lineNumber: 19,\n                columnNumber: 13\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: (_event_item_module_css__WEBPACK_IMPORTED_MODULE_5___default().content),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: (_event_item_module_css__WEBPACK_IMPORTED_MODULE_5___default().summary),\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                            children: title\n                        }, void 0, false, {\n                            fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                            lineNumber: 22,\n                            columnNumber: 21\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                        lineNumber: 21,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: (_event_item_module_css__WEBPACK_IMPORTED_MODULE_5___default().date),\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_icons_date_icon__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {}, void 0, false, {\n                                fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                                lineNumber: 25,\n                                columnNumber: 21\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"time\", {\n                                children: humanReadableDate\n                            }, void 0, false, {\n                                fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                                lineNumber: 26,\n                                columnNumber: 21\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                        lineNumber: 24,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: (_event_item_module_css__WEBPACK_IMPORTED_MODULE_5___default().address),\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_icons_address_icon__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {}, void 0, false, {\n                                fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                                lineNumber: 29,\n                                columnNumber: 21\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"address\", {\n                                children: formattedAddress\n                            }, void 0, false, {\n                                fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                                lineNumber: 30,\n                                columnNumber: 21\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                        lineNumber: 28,\n                        columnNumber: 17\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: (_event_item_module_css__WEBPACK_IMPORTED_MODULE_5___default().actions),\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_button__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                            link: exploreLink,\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    children: \"Explore Event\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                                    lineNumber: 34,\n                                    columnNumber: 25\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    className: (_event_item_module_css__WEBPACK_IMPORTED_MODULE_5___default().icon),\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_icons_arrow_right_icon__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {}, void 0, false, {\n                                        fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                                        lineNumber: 38,\n                                        columnNumber: 29\n                                    }, this)\n                                }, void 0, false, {\n                                    fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                                    lineNumber: 37,\n                                    columnNumber: 25\n                                }, this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                            lineNumber: 33,\n                            columnNumber: 21\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                        lineNumber: 32,\n                        columnNumber: 17\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n                lineNumber: 20,\n                columnNumber: 13\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/events/event-item.js\",\n        lineNumber: 18,\n        columnNumber: 9\n    }, this);\n}\n_c = EventItem;\n/* harmony default export */ __webpack_exports__[\"default\"] = (EventItem);\nvar _c;\n$RefreshReg$(_c, \"EventItem\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL2V2ZW50cy9ldmVudC1pdGVtLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBa0M7QUFDVztBQUNKO0FBQ087QUFDTTtBQUN0RCxTQUFTSyxVQUFVQyxLQUFLO0lBQ3BCLE1BQU0sRUFBQ0MsS0FBSyxFQUFFQyxLQUFLLEVBQUVDLElBQUksRUFBRUMsUUFBUSxFQUFFQyxFQUFFLEVBQUMsR0FBR0w7SUFFM0MsTUFBTU0sb0JBQW9CLElBQUlDLEtBQUtKLE1BQU1LLGtCQUFrQixDQUFDLFNBQVM7UUFDakVDLEtBQUs7UUFDTEMsT0FBTztRQUNQQyxNQUFNO0lBQ1Y7SUFDQUMsUUFBUUMsR0FBRyxDQUFDLFNBQVNYO0lBQ3JCLE1BQU1ZLG1CQUFtQlYsU0FBU1csT0FBTyxDQUFDLE1BQU07SUFDaEQsTUFBTUMsY0FBYyxXQUFjLE9BQUhYO0lBQy9CLHFCQUNJLDhEQUFDWTtRQUFHQyxXQUFXdkIsb0VBQVk7OzBCQUN2Qiw4REFBQ3lCO2dCQUFJQyxLQUFLLE1BQU1uQjtnQkFBT29CLEtBQUtyQjs7Ozs7OzBCQUM1Qiw4REFBQ3NCO2dCQUFJTCxXQUFXdkIsdUVBQWU7O2tDQUMzQiw4REFBQzRCO3dCQUFJTCxXQUFXdkIsdUVBQWU7a0NBQzNCLDRFQUFDK0I7c0NBQUl6Qjs7Ozs7Ozs7Ozs7a0NBRVQsOERBQUNzQjt3QkFBSUwsV0FBV3ZCLG9FQUFZOzswQ0FDeEIsOERBQUNDLHdEQUFRQTs7Ozs7MENBQ1QsOERBQUMrQjswQ0FBTXJCOzs7Ozs7Ozs7Ozs7a0NBRVgsOERBQUNpQjt3QkFBSUwsV0FBV3ZCLHVFQUFlOzswQ0FDM0IsOERBQUNFLDJEQUFXQTs7Ozs7MENBQ1osOERBQUMrQjswQ0FBU2Q7Ozs7Ozs7Ozs7OztrQ0FFZCw4REFBQ1M7d0JBQUlMLFdBQVd2Qix1RUFBZTtrQ0FDM0IsNEVBQUNELGtEQUFNQTs0QkFBQ29DLE1BQU1kOzs4Q0FDViw4REFBQ2U7OENBQUs7Ozs7Ozs4Q0FHTiw4REFBQ0E7b0NBQUtiLFdBQVd2QixvRUFBWTs4Q0FDekIsNEVBQUNHLCtEQUFjQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTzNDO0tBdkNTQztBQXlDVCwrREFBZUEsU0FBU0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL2V2ZW50cy9ldmVudC1pdGVtLmpzPzZmZTkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi4vdWkvYnV0dG9uXCI7XG5pbXBvcnQgY2xhc3NlcyBmcm9tICcuL2V2ZW50LWl0ZW0ubW9kdWxlLmNzcydcbmltcG9ydCBEYXRlSWNvbiBmcm9tICcuLi9pY29ucy9kYXRlLWljb24nXG5pbXBvcnQgQWRkcmVzc0ljb24gZnJvbSBcIi4uL2ljb25zL2FkZHJlc3MtaWNvblwiO1xuaW1wb3J0IEFycm93UmlnaHRJY29uIGZyb20gJy4uL2ljb25zL2Fycm93LXJpZ2h0LWljb24nXG5mdW5jdGlvbiBFdmVudEl0ZW0ocHJvcHMpIHtcbiAgICBjb25zdCB7dGl0bGUsIGltYWdlLCBkYXRlLCBsb2NhdGlvbiwgaWR9ID0gcHJvcHM7XG5cbiAgICBjb25zdCBodW1hblJlYWRhYmxlRGF0ZSA9IG5ldyBEYXRlKGRhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZygnZW4tVVMnLCB7XG4gICAgICAgIGRheTogJ251bWVyaWMnLFxuICAgICAgICBtb250aDogJ2xvbmcnLFxuICAgICAgICB5ZWFyOiAnbnVtZXJpYydcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZygnaW1hZ2UnLCBpbWFnZSlcbiAgICBjb25zdCBmb3JtYXR0ZWRBZGRyZXNzID0gbG9jYXRpb24ucmVwbGFjZSgnLCAnLCAnXFxuJyk7XG4gICAgY29uc3QgZXhwbG9yZUxpbmsgPSBgL2V2ZW50cy8ke2lkfWA7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3Nlcy5pdGVtfT5cbiAgICAgICAgICAgIDxpbWcgc3JjPXsnLycgKyBpbWFnZX0gYWx0PXt0aXRsZX0gLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzLmNvbnRlbnR9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzLnN1bW1hcnl9PlxuICAgICAgICAgICAgICAgICAgICA8aDI+e3RpdGxlfTwvaDI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXMuZGF0ZX0+XG4gICAgICAgICAgICAgICAgICAgIDxEYXRlSWNvbiAvPlxuICAgICAgICAgICAgICAgICAgICA8dGltZT57aHVtYW5SZWFkYWJsZURhdGV9PC90aW1lPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzLmFkZHJlc3N9PlxuICAgICAgICAgICAgICAgICAgICA8QWRkcmVzc0ljb24gLz5cbiAgICAgICAgICAgICAgICAgICAgPGFkZHJlc3M+e2Zvcm1hdHRlZEFkZHJlc3N9PC9hZGRyZXNzPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzLmFjdGlvbnN9PlxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGxpbms9e2V4cGxvcmVMaW5rfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgRXhwbG9yZSBFdmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc2VzLmljb259PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxBcnJvd1JpZ2h0SWNvbiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2xpPlxuICAgIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRJdGVtOyJdLCJuYW1lcyI6WyJCdXR0b24iLCJjbGFzc2VzIiwiRGF0ZUljb24iLCJBZGRyZXNzSWNvbiIsIkFycm93UmlnaHRJY29uIiwiRXZlbnRJdGVtIiwicHJvcHMiLCJ0aXRsZSIsImltYWdlIiwiZGF0ZSIsImxvY2F0aW9uIiwiaWQiLCJodW1hblJlYWRhYmxlRGF0ZSIsIkRhdGUiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJkYXkiLCJtb250aCIsInllYXIiLCJjb25zb2xlIiwibG9nIiwiZm9ybWF0dGVkQWRkcmVzcyIsInJlcGxhY2UiLCJleHBsb3JlTGluayIsImxpIiwiY2xhc3NOYW1lIiwiaXRlbSIsImltZyIsInNyYyIsImFsdCIsImRpdiIsImNvbnRlbnQiLCJzdW1tYXJ5IiwiaDIiLCJ0aW1lIiwiYWRkcmVzcyIsImFjdGlvbnMiLCJsaW5rIiwic3BhbiIsImljb24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/events/event-item.js\n"));

/***/ }),

/***/ "./components/icons/arrow-right-icon.js":
/*!**********************************************!*\
  !*** ./components/icons/arrow-right-icon.js ***!
  \**********************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction ArrowRightIcon() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n        xmlns: \"http://www.w3.org/2000/svg\",\n        viewBox: \"0 0 20 20\",\n        fill: \"currentColor\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n            fillRule: \"evenodd\",\n            d: \"M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z\",\n            clipRule: \"evenodd\"\n        }, void 0, false, {\n            fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/icons/arrow-right-icon.js\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/christianmartinez/Documents/GitHub/next-js-udemy-courses/nextjs-course-code/starting-project/components/icons/arrow-right-icon.js\",\n        lineNumber: 3,\n        columnNumber: 5\n    }, this);\n}\n_c = ArrowRightIcon;\n/* harmony default export */ __webpack_exports__[\"default\"] = (ArrowRightIcon);\nvar _c;\n$RefreshReg$(_c, \"ArrowRightIcon\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL2ljb25zL2Fycm93LXJpZ2h0LWljb24uanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFNBQVNBO0lBQ1AscUJBQ0UsOERBQUNDO1FBQ0NDLE9BQU07UUFDTkMsU0FBUTtRQUNSQyxNQUFLO2tCQUVMLDRFQUFDQztZQUNDQyxVQUFTO1lBQ1RDLEdBQUU7WUFDRkMsVUFBUzs7Ozs7Ozs7Ozs7QUFJakI7S0FkU1I7QUFnQlQsK0RBQWVBLGNBQWNBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9pY29ucy9hcnJvdy1yaWdodC1pY29uLmpzPzMxOTAiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gQXJyb3dSaWdodEljb24oKSB7XG4gIHJldHVybiAoXG4gICAgPHN2Z1xuICAgICAgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJ1xuICAgICAgdmlld0JveD0nMCAwIDIwIDIwJ1xuICAgICAgZmlsbD0nY3VycmVudENvbG9yJ1xuICAgID5cbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGxSdWxlPSdldmVub2RkJ1xuICAgICAgICBkPSdNMTIuMjkzIDUuMjkzYTEgMSAwIDAxMS40MTQgMGw0IDRhMSAxIDAgMDEwIDEuNDE0bC00IDRhMSAxIDAgMDEtMS40MTQtMS40MTRMMTQuNTg2IDExSDNhMSAxIDAgMTEwLTJoMTEuNTg2bC0yLjI5My0yLjI5M2ExIDEgMCAwMTAtMS40MTR6J1xuICAgICAgICBjbGlwUnVsZT0nZXZlbm9kZCdcbiAgICAgIC8+XG4gICAgPC9zdmc+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFycm93UmlnaHRJY29uO1xuIl0sIm5hbWVzIjpbIkFycm93UmlnaHRJY29uIiwic3ZnIiwieG1sbnMiLCJ2aWV3Qm94IiwiZmlsbCIsInBhdGgiLCJmaWxsUnVsZSIsImQiLCJjbGlwUnVsZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/icons/arrow-right-icon.js\n"));

/***/ })

});