"use strict";

exports.__esModule = true;
exports.processTaggedTemplateExpression = processTaggedTemplateExpression;
exports["default"] = _default;
exports.visitor = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _constants = require("./_constants");

var _utils = require("./_utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var isModuleExports = t.buildMatchMemberExpression('module.exports');

function processTaggedTemplateExpression(_ref) {
  var type = _ref.type,
      path = _ref.path,
      file = _ref.file,
      splitRules = _ref.splitRules,
      plugins = _ref.plugins,
      vendorPrefixes = _ref.vendorPrefixes,
      sourceMaps = _ref.sourceMaps;
  var templateLiteral = path.get('quasi');
  var scope; // Check whether there are undefined references or
  // references to this.something (e.g. props or state).
  // We allow dynamic styles only when resolving styles.

  if (type !== 'resolve') {
    (0, _utils.validateExternalExpressions)(templateLiteral);
  } else if (!path.scope.path.isProgram()) {
    scope = (0, _utils.getScope)(path);
  }

  var stylesInfo = (0, _utils.getJSXStyleInfo)(templateLiteral, scope);

  var _computeClassNames = (0, _utils.computeClassNames)([stylesInfo]),
      staticClassName = _computeClassNames.staticClassName,
      className = _computeClassNames.className;

  var styles = (0, _utils.processCss)(_extends({}, stylesInfo, {
    staticClassName: staticClassName,
    file: file,
    isGlobal: type === 'global',
    plugins: plugins,
    vendorPrefixes: vendorPrefixes,
    sourceMaps: sourceMaps
  }), {
    splitRules: splitRules
  });

  if (type === 'resolve') {
    var hash = styles.hash,
        _css = styles.css,
        expressions = styles.expressions;
    path.replaceWith( // {
    //   styles: <_JSXStyle ... />,
    //   className: 'jsx-123'
    // }
    t.objectExpression([t.objectProperty(t.identifier('styles'), (0, _utils.makeStyledJsxTag)(hash, _css, expressions)), t.objectProperty(t.identifier('className'), className)]));
    return;
  }

  var id = path.parentPath.node.id;
  var baseExportName = id ? id.name : 'default';
  var parentPath = baseExportName === 'default' ? path.parentPath : path.findParent(function (path) {
    return path.isVariableDeclaration() || path.isAssignmentExpression() && isModuleExports(path.get('left').node);
  });

  if (baseExportName !== 'default' && !parentPath.parentPath.isProgram()) {
    parentPath = parentPath.parentPath;
  }

  var css = (0, _utils.cssToBabelType)(styles.css);
  var newPath = t.isArrayExpression(css) ? css : t.newExpression(t.identifier('String'), [css]); // default exports

  if (baseExportName === 'default') {
    var defaultExportIdentifier = path.scope.generateUidIdentifier('defaultExport');
    parentPath.insertBefore(t.variableDeclaration('const', [t.variableDeclarator(defaultExportIdentifier, newPath)]));
    parentPath.insertBefore(addHash(defaultExportIdentifier, styles.hash));
    path.replaceWith(defaultExportIdentifier);
    return;
  } // local and named exports


  parentPath.insertAfter(addHash(t.identifier(baseExportName), styles.hash));
  path.replaceWith(newPath);
}

function addHash(exportIdentifier, hash) {
  var value = typeof hash === 'string' ? t.stringLiteral(hash) : hash;
  return t.expressionStatement(t.assignmentExpression('=', t.memberExpression(exportIdentifier, t.identifier('__hash')), value));
}

var visitor = {
  ImportDeclaration: function ImportDeclaration(path, state) {
    // import css from 'styled-jsx/css'
    if (path.node.source.value !== 'styled-jsx/css') {
      return;
    } // Find all the imported specifiers.
    // e.g import css, { global, resolve } from 'styled-jsx/css'
    // -> ['css', 'global', 'resolve']


    var specifiersNames = path.node.specifiers.map(function (specifier) {
      return specifier.local.name;
    });
    specifiersNames.forEach(function (tagName) {
      // Get all the reference paths i.e. the places that use the tagName above
      // eg.
      // css`div { color: red }`
      // css.global`div { color: red }`
      // global`div { color: red `
      var binding = path.scope.getBinding(tagName);

      if (!binding || !Array.isArray(binding.referencePaths)) {
        return;
      } // Produces an object containing all the TaggedTemplateExpression paths detected.
      // The object contains { scoped, global, resolve }


      var taggedTemplateExpressions = binding.referencePaths.map(function (ref) {
        return ref.parentPath;
      }).reduce(function (result, path) {
        var taggedTemplateExpression;

        if (path.isTaggedTemplateExpression()) {
          // css`` global`` resolve``
          taggedTemplateExpression = path;
        } else if (path.parentPath && path.isMemberExpression() && path.parentPath.isTaggedTemplateExpression()) {
          // This part is for css.global`` or css.resolve``
          // using the default import css
          taggedTemplateExpression = path.parentPath;
        } else {
          return result;
        }

        var tag = taggedTemplateExpression.get('tag');
        var id = tag.isIdentifier() ? tag.node.name : tag.get('property').node.name;

        if (result[id]) {
          result[id].push(taggedTemplateExpression);
        } else {
          result.scoped.push(taggedTemplateExpression);
        }

        return result;
      }, {
        scoped: [],
        global: [],
        resolve: []
      });
      var hasJSXStyle = false;
      var _state$opts = state.opts,
          vendorPrefixes = _state$opts.vendorPrefixes,
          sourceMaps = _state$opts.sourceMaps;
      Object.keys(taggedTemplateExpressions).forEach(function (type) {
        return taggedTemplateExpressions[type].forEach(function (path) {
          hasJSXStyle = true; // Process each css block

          processTaggedTemplateExpression({
            type: type,
            path: path,
            file: state.file,
            splitRules: typeof state.opts.optimizeForSpeed === 'boolean' ? state.opts.optimizeForSpeed : process.env.NODE_ENV === 'production',
            plugins: state.plugins,
            vendorPrefixes: vendorPrefixes,
            sourceMaps: sourceMaps
          });
        });
      }); // When using the `resolve` helper we need to add an import
      // for the _JSXStyle component `styled-jsx/style`

      if (hasJSXStyle && taggedTemplateExpressions.resolve.length > 0 && !state.hasInjectedJSXStyle && !path.scope.hasBinding(_constants.STYLE_COMPONENT)) {
        state.hasInjectedJSXStyle = true;
        var importDeclaration = (0, _utils.createReactComponentImportDeclaration)(state);
        path.scope.path.node.body.unshift(importDeclaration);
      }
    }); // Finally remove the import

    path.remove();
  }
};
exports.visitor = visitor;

function _default() {
  return _extends({
    Program: function Program(path, state) {
      (0, _utils.setStateOptions)(state);
    }
  }, visitor);
}