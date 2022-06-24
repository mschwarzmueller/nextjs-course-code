"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _babelPluginSyntaxJsx = _interopRequireDefault(require("babel-plugin-syntax-jsx"));

var _babelExternal = require("./babel-external");

var _utils = require("./_utils");

var _constants = require("./_constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _default(_ref) {
  var t = _ref.types;
  var jsxVisitors = {
    JSXOpeningElement: function JSXOpeningElement(path, state) {
      var el = path.node;

      var _ref2 = el.name || {},
          name = _ref2.name;

      if (!state.hasJSXStyle) {
        return;
      }

      if (state.ignoreClosing === null) {
        // We keep a counter of elements inside so that we
        // can keep track of when we exit the parent to reset state
        // note: if we wished to add an option to turn off
        // selectors to reach parent elements, it would suffice to
        // set this to `1` and do an early return instead
        state.ignoreClosing = 0;
      }

      var tag = path.get('name');

      if (name && name !== 'style' && name !== _constants.STYLE_COMPONENT && (name.charAt(0) !== name.charAt(0).toUpperCase() || Object.values(path.scope.bindings).some(function (binding) {
        return binding.referencePaths.some(function (r) {
          return r === tag;
        });
      }))) {
        if (state.className) {
          (0, _utils.addClassName)(path, state.className);
        }
      }

      state.ignoreClosing++; // Next visit will be: JSXElement exit()
    },
    JSXElement: {
      enter: function enter(path, state) {
        if (state.hasJSXStyle !== null) {
          return;
        }

        var styles = (0, _utils.findStyles)(path);

        if (styles.length === 0) {
          return;
        }

        state.styles = [];
        state.externalStyles = [];
        var scope = (0, _utils.getScope)(path);

        for (var _iterator = _createForOfIteratorHelperLoose(styles), _step; !(_step = _iterator()).done;) {
          var style = _step.value;
          // Compute children excluding whitespace
          var children = style.get('children').filter(function (c) {
            return t.isJSXExpressionContainer(c.node) || // Ignore whitespace around the expression container
            t.isJSXText(c.node) && c.node.value.trim() !== '';
          });

          if (children.length !== 1) {
            throw path.buildCodeFrameError("Expected one child under " + ("JSX Style tag, but got " + children.length + " ") + "(eg: <style jsx>{`hi`}</style>)");
          }

          var child = children[0];

          if (!t.isJSXExpressionContainer(child)) {
            throw path.buildCodeFrameError("Expected a child of " + "type JSXExpressionContainer under JSX Style tag " + ("(eg: <style jsx>{`hi`}</style>), got " + child.type));
          }

          var expression = child.get('expression');

          if (t.isIdentifier(expression)) {
            var idName = expression.node.name;

            if (expression.scope.hasBinding(idName)) {
              var externalStylesIdentifier = t.identifier(idName);
              var isGlobal = (0, _utils.isGlobalEl)(style.get('openingElement').node);
              state.externalStyles.push([t.memberExpression(externalStylesIdentifier, t.identifier('__hash')), externalStylesIdentifier, isGlobal]);
              continue;
            }

            throw path.buildCodeFrameError("The Identifier " + ("`" + expression.getSource() + "` is either `undefined` or ") + "it is not an external StyleSheet reference i.e. " + "it doesn't come from an `import` or `require` statement");
          }

          if (!t.isTemplateLiteral(expression) && !t.isStringLiteral(expression)) {
            throw path.buildCodeFrameError("Expected a template " + "literal or String literal as the child of the " + "JSX Style tag (eg: <style jsx>{`some css`}</style>)," + (" but got " + expression.type));
          }

          state.styles.push((0, _utils.getJSXStyleInfo)(expression, scope));
        }

        var externalJsxId;

        if (state.externalStyles.length > 0) {
          var expressions = state.externalStyles // Remove globals
          .filter(function (s) {
            return !s[2];
          }).map(function (s) {
            return s[0];
          });
          var expressionsLength = expressions.length;

          if (expressionsLength === 0) {
            externalJsxId = null;
          } else {
            // Construct a template literal of this form:
            // `jsx-${styles.__scopedHash} jsx-${otherStyles.__scopedHash}`
            externalJsxId = t.templateLiteral([t.templateElement({
              raw: 'jsx-',
              cooked: 'jsx-'
            })].concat([].concat(new Array(expressionsLength - 1).fill(null)).map(function () {
              return t.templateElement({
                raw: ' jsx-',
                cooked: ' jsx-'
              });
            }), [t.templateElement({
              raw: '',
              cooked: ''
            }, true)]), expressions);
          }
        }

        if (state.styles.length > 0 || externalJsxId) {
          var _computeClassNames = (0, _utils.computeClassNames)(state.styles, externalJsxId),
              staticClassName = _computeClassNames.staticClassName,
              className = _computeClassNames.className;

          state.className = className;
          state.staticClassName = staticClassName;
        }

        state.hasJSXStyle = true;
        state.file.hasJSXStyle = true; // Next visit will be: JSXOpeningElement
      },
      exit: function exit(path, state) {
        var isGlobal = (0, _utils.isGlobalEl)(path.node.openingElement);

        if (state.hasJSXStyle && ! --state.ignoreClosing && !isGlobal) {
          state.hasJSXStyle = null;
          state.className = null;
          state.externalJsxId = null;
        }

        if (!state.hasJSXStyle || !(0, _utils.isStyledJsx)(path)) {
          return;
        }

        if (state.ignoreClosing > 1) {
          var styleTagSrc;

          try {
            styleTagSrc = path.getSource();
          } catch (error) {}

          throw path.buildCodeFrameError('Detected nested style tag' + (styleTagSrc ? ": \n\n" + styleTagSrc + "\n\n" : ' ') + 'styled-jsx only allows style tags ' + 'to be direct descendants (children) of the outermost ' + 'JSX element i.e. the subtree root.');
        }

        if (state.externalStyles.length > 0 && path.get('children').filter(function (child) {
          if (!t.isJSXExpressionContainer(child)) {
            return false;
          }

          var expression = child.get('expression');
          return expression && expression.isIdentifier();
        }).length === 1) {
          var _state$externalStyles = state.externalStyles.shift(),
              id = _state$externalStyles[0],
              _css = _state$externalStyles[1];

          path.replaceWith((0, _utils.makeStyledJsxTag)(id, _css));
          return;
        }

        var _state$opts = state.opts,
            vendorPrefixes = _state$opts.vendorPrefixes,
            sourceMaps = _state$opts.sourceMaps;

        var stylesInfo = _extends({}, state.styles.shift(), {
          file: state.file,
          staticClassName: state.staticClassName,
          isGlobal: isGlobal,
          plugins: state.plugins,
          vendorPrefixes: vendorPrefixes,
          sourceMaps: sourceMaps
        });

        var splitRules = typeof state.opts.optimizeForSpeed === 'boolean' ? state.opts.optimizeForSpeed : process.env.NODE_ENV === 'production';

        var _processCss = (0, _utils.processCss)(stylesInfo, {
          splitRules: splitRules
        }),
            hash = _processCss.hash,
            css = _processCss.css,
            expressions = _processCss.expressions;

        path.replaceWith((0, _utils.makeStyledJsxTag)(hash, css, expressions));
      }
    }
  }; // only apply JSXFragment visitor if supported

  if (t.isJSXFragment) {
    jsxVisitors.JSXFragment = jsxVisitors.JSXElement;
    jsxVisitors.JSXOpeningFragment = {
      enter: function enter(path, state) {
        if (!state.hasJSXStyle) {
          return;
        }

        if (state.ignoreClosing === null) {
          // We keep a counter of elements inside so that we
          // can keep track of when we exit the parent to reset state
          // note: if we wished to add an option to turn off
          // selectors to reach parent elements, it would suffice to
          // set this to `1` and do an early return instead
          state.ignoreClosing = 0;
        }

        state.ignoreClosing++;
      }
    };
  }

  var visitors = {
    inherits: _babelPluginSyntaxJsx["default"],
    visitor: {
      Program: {
        enter: function enter(path, state) {
          state.hasJSXStyle = null;
          state.ignoreClosing = null;
          state.file.hasJSXStyle = false;
          (0, _utils.setStateOptions)(state); // we need to beat the arrow function transform and
          // possibly others so we traverse from here or else
          // dynamic values in classNames could be incorrect

          path.traverse(jsxVisitors, state); // Transpile external styles

          path.traverse(_babelExternal.visitor, state);
        },
        exit: function exit(_ref3, state) {
          var node = _ref3.node,
              scope = _ref3.scope;

          if (!(state.file.hasJSXStyle && !state.hasInjectedJSXStyle && !scope.hasBinding(_constants.STYLE_COMPONENT))) {
            return;
          }

          state.hasInjectedJSXStyle = true;
          var importDeclaration = (0, _utils.createReactComponentImportDeclaration)(state);
          node.body.unshift(importDeclaration);
        }
      }
    }
  };
  return visitors;
}