"use strict";

exports.__esModule = true;
exports.log = log;
exports.setStateOptions = exports.createReactComponentImportDeclaration = exports.booleanOption = exports.processCss = exports.combinePlugins = exports.addSourceMaps = exports.makeSourceMapGenerator = exports.makeStyledJsxTag = exports.cssToBabelType = exports.templateLiteralFromPreprocessedCss = exports.computeClassNames = exports.getJSXStyleInfo = exports.validateExternalExpressions = exports.findStyles = exports.isStyledJsx = exports.isGlobalEl = exports.getScope = exports.addClassName = exports.hashString = void 0;

var _path = _interopRequireDefault(require("path"));

var t = _interopRequireWildcard(require("@babel/types"));

var _stringHash = _interopRequireDefault(require("string-hash"));

var _sourceMap = require("source-map");

var _convertSourceMap = _interopRequireDefault(require("convert-source-map"));

var _styleTransform = _interopRequireDefault(require("./lib/style-transform"));

var _constants = require("./_constants");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var concat = function concat(a, b) {
  return t.binaryExpression('+', a, b);
};

var and = function and(a, b) {
  return t.logicalExpression('&&', a, b);
};

var or = function or(a, b) {
  return t.logicalExpression('||', a, b);
};

var joinSpreads = function joinSpreads(spreads) {
  return spreads.reduce(function (acc, curr) {
    return or(acc, curr);
  });
};

var hashString = function hashString(str) {
  return String((0, _stringHash["default"])(str));
};

exports.hashString = hashString;

var addClassName = function addClassName(path, jsxId) {
  var jsxIdWithSpace = concat(jsxId, t.stringLiteral(' '));
  var attributes = path.get('attributes');
  var spreads = [];
  var className = null; // Find className and collect spreads

  for (var i = attributes.length - 1, attr; attr = attributes[i]; i--) {
    var node = attr.node;

    if (t.isJSXSpreadAttribute(attr)) {
      if (t.isObjectExpression(node.argument)) {
        var properties = node.argument.properties;
        var index = properties.findIndex(function (property) {
          return property.key.name === 'className';
        });

        if (~index) {
          className = attr.get('argument').get("properties." + index); // Remove jsx spread attribute if there is only className property

          if (properties.length === 1) {
            attr.remove();
          }

          break;
        }
      }

      if (t.isMemberExpression(node.argument) || t.isIdentifier(node.argument)) {
        var name = node.argument.name;
        var spreadObj = t.isMemberExpression(node.argument) ? node.argument : t.identifier(name);
        var attrNameDotClassName = t.memberExpression(spreadObj, t.identifier('className'));
        spreads.push( // `${name} && ${name}.className != null && ${name}.className`
        and(spreadObj, and(t.binaryExpression('!=', attrNameDotClassName, t.nullLiteral()), attrNameDotClassName)));
      }

      continue;
    }

    if (t.isJSXAttribute(attr) && node.name.name === 'className') {
      className = attributes[i]; // found className break the loop

      break;
    }
  }

  if (className) {
    var newClassName = className.node.value.expression || className.node.value;
    newClassName = t.isStringLiteral(newClassName) || t.isTemplateLiteral(newClassName) ? newClassName : or(newClassName, t.stringLiteral(''));
    className.remove();
    className = t.jSXExpressionContainer(spreads.length === 0 ? concat(jsxIdWithSpace, newClassName) : concat(jsxIdWithSpace, or(joinSpreads(spreads), newClassName)));
  } else {
    className = t.jSXExpressionContainer(spreads.length === 0 ? jsxId : concat(jsxIdWithSpace, or(joinSpreads(spreads), t.stringLiteral(''))));
  }

  path.node.attributes.push(t.jSXAttribute(t.jSXIdentifier('className'), className));
};

exports.addClassName = addClassName;

var getScope = function getScope(path) {
  return (path.findParent(function (path) {
    return path.isFunctionDeclaration() || path.isArrowFunctionExpression() || path.isClassMethod();
  }) || path).scope;
};

exports.getScope = getScope;

var isGlobalEl = function isGlobalEl(el) {
  return el && el.attributes.some(function (_ref) {
    var name = _ref.name;
    return name && name.name === _constants.GLOBAL_ATTRIBUTE;
  });
};

exports.isGlobalEl = isGlobalEl;

var isStyledJsx = function isStyledJsx(_ref2) {
  var el = _ref2.node;
  return t.isJSXElement(el) && el.openingElement.name.name === 'style' && el.openingElement.attributes.some(function (attr) {
    return attr.name.name === _constants.STYLE_ATTRIBUTE;
  });
};

exports.isStyledJsx = isStyledJsx;

var findStyles = function findStyles(path) {
  if (isStyledJsx(path)) {
    var node = path.node;
    return isGlobalEl(node.openingElement) ? [path] : [];
  }

  return path.get('children').filter(isStyledJsx);
};

exports.findStyles = findStyles;
var validateExternalExpressionsVisitor = {
  Identifier: function Identifier(path) {
    if (t.isMemberExpression(path.parentPath)) {
      return;
    }

    var name = path.node.name;

    if (!path.scope.hasBinding(name)) {
      throw path.buildCodeFrameError(path.getSource());
    }
  },
  MemberExpression: function MemberExpression(path) {
    var node = path.node;

    if (!t.isIdentifier(node.object)) {
      return;
    }

    if (!path.scope.hasBinding(node.object.name)) {
      throw path.buildCodeFrameError(path.getSource());
    }
  },
  ThisExpression: function ThisExpression(path) {
    throw new Error(path.parentPath.getSource());
  }
};

var validateExternalExpressions = function validateExternalExpressions(path) {
  try {
    path.traverse(validateExternalExpressionsVisitor);
  } catch (error) {
    throw path.buildCodeFrameError("\n      Found an `undefined` or invalid value in your styles: `" + error.message + "`.\n\n      If you are trying to use dynamic styles in external files this is unfortunately not possible yet.\n      Please put the dynamic parts alongside the component. E.g.\n\n      <button>\n        <style jsx>{externalStylesReference}</style>\n        <style jsx>{`\n          button { background-color: ${" + error.message + "} }\n        `}</style>\n      </button>\n    ");
  }
};

exports.validateExternalExpressions = validateExternalExpressions;

var getJSXStyleInfo = function getJSXStyleInfo(expr, scope) {
  var node = expr.node;
  var location = node.loc; // Assume string literal

  if (t.isStringLiteral(node)) {
    return {
      hash: hashString(node.value),
      css: node.value,
      expressions: [],
      dynamic: false,
      location: location
    };
  } // Simple template literal without expressions


  if (node.expressions.length === 0) {
    return {
      hash: hashString(node.quasis[0].value.raw),
      css: node.quasis[0].value.raw,
      expressions: [],
      dynamic: false,
      location: location
    };
  } // Special treatment for template literals that contain expressions:
  //
  // Expressions are replaced with a placeholder
  // so that the CSS compiler can parse and
  // transform the css source string
  // without having to know about js literal expressions.
  // Later expressions are restored.
  //
  // e.g.
  // p { color: ${myConstant}; }
  // becomes
  // p { color: %%styled-jsx-placeholder-${id}%%; }


  var quasis = node.quasis,
      expressions = node.expressions;
  var hash = hashString(expr.getSource().slice(1, -1));
  var dynamic = Boolean(scope);

  if (dynamic) {
    try {
      var val = expr.evaluate();

      if (val.confident) {
        dynamic = false;
      } else if (val.deopt) {
        var computedObject = val.deopt.get('object').resolve().evaluate();
        dynamic = !computedObject.confident;
      }
    } catch (_) {}
  }

  var css = quasis.reduce(function (css, quasi, index) {
    return "" + css + quasi.value.raw + (quasis.length === index + 1 ? '' : "%%styled-jsx-placeholder-" + index + "%%");
  }, '');
  return {
    hash: hash,
    css: css,
    expressions: expressions,
    dynamic: dynamic,
    location: location
  };
};

exports.getJSXStyleInfo = getJSXStyleInfo;

var computeClassNames = function computeClassNames(styles, externalJsxId) {
  if (styles.length === 0) {
    return {
      className: externalJsxId
    };
  }

  var hashes = styles.reduce(function (acc, styles) {
    if (styles.dynamic === false) {
      acc["static"].push(styles.hash);
    } else {
      acc.dynamic.push(styles);
    }

    return acc;
  }, {
    "static": [],
    dynamic: []
  });
  var staticClassName = "jsx-" + hashString(hashes["static"].join(',')); // Static and optionally external classes. E.g.
  // '[jsx-externalClasses] jsx-staticClasses'

  if (hashes.dynamic.length === 0) {
    return {
      staticClassName: staticClassName,
      className: externalJsxId ? concat(t.stringLiteral(staticClassName + ' '), externalJsxId) : t.stringLiteral(staticClassName)
    };
  } // _JSXStyle.dynamic([ ['1234', [props.foo, bar, fn(props)]], ... ])


  var dynamic = t.callExpression( // Callee: _JSXStyle.dynamic
  t.memberExpression(t.identifier(_constants.STYLE_COMPONENT), t.identifier('dynamic')), // Arguments
  [t.arrayExpression(hashes.dynamic.map(function (styles) {
    return t.arrayExpression([t.stringLiteral(hashString(styles.hash + staticClassName)), t.arrayExpression(styles.expressions)]);
  }))]); // Dynamic and optionally external classes. E.g.
  // '[jsx-externalClasses] ' + _JSXStyle.dynamic([ ['1234', [props.foo, bar, fn(props)]], ... ])

  if (hashes["static"].length === 0) {
    return {
      staticClassName: staticClassName,
      className: externalJsxId ? concat(concat(externalJsxId, t.stringLiteral(' ')), dynamic) : dynamic
    };
  } // Static, dynamic and optionally external classes. E.g.
  // '[jsx-externalClasses] jsx-staticClasses ' + _JSXStyle.dynamic([ ['5678', [props.foo, bar, fn(props)]], ... ])


  return {
    staticClassName: staticClassName,
    className: externalJsxId ? concat(concat(externalJsxId, t.stringLiteral(" " + staticClassName + " ")), dynamic) : concat(t.stringLiteral(staticClassName + " "), dynamic)
  };
};

exports.computeClassNames = computeClassNames;

var templateLiteralFromPreprocessedCss = function templateLiteralFromPreprocessedCss(css, expressions) {
  var quasis = [];
  var finalExpressions = [];
  var parts = css.split(/(?:%%styled-jsx-placeholder-(\d+)%%)/g);

  if (parts.length === 1) {
    return t.stringLiteral(css);
  }

  parts.forEach(function (part, index) {
    if (index % 2 > 0) {
      // This is necessary because, after preprocessing, declarations might have been alterate.
      // eg. properties are auto prefixed and therefore expressions need to match.
      finalExpressions.push(expressions[part]);
    } else {
      quasis.push(part);
    }
  });
  return t.templateLiteral(quasis.map(function (quasi, index) {
    return t.templateElement({
      raw: quasi,
      cooked: quasi
    }, quasis.length === index + 1);
  }), finalExpressions);
};

exports.templateLiteralFromPreprocessedCss = templateLiteralFromPreprocessedCss;

var cssToBabelType = function cssToBabelType(css) {
  if (typeof css === 'string') {
    return t.stringLiteral(css);
  }

  if (Array.isArray(css)) {
    return t.arrayExpression(css);
  }

  return t.cloneDeep(css);
};

exports.cssToBabelType = cssToBabelType;

var makeStyledJsxTag = function makeStyledJsxTag(id, transformedCss, expressions) {
  if (expressions === void 0) {
    expressions = [];
  }

  var css = cssToBabelType(transformedCss);
  var attributes = [t.jSXAttribute(t.jSXIdentifier(_constants.STYLE_COMPONENT_ID), t.jSXExpressionContainer(typeof id === 'string' ? t.stringLiteral(id) : id))];

  if (expressions.length > 0) {
    attributes.push(t.jSXAttribute(t.jSXIdentifier(_constants.STYLE_COMPONENT_DYNAMIC), t.jSXExpressionContainer(t.arrayExpression(expressions))));
  }

  return t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier(_constants.STYLE_COMPONENT), attributes), t.jSXClosingElement(t.jSXIdentifier(_constants.STYLE_COMPONENT)), [t.jSXExpressionContainer(css)]);
};

exports.makeStyledJsxTag = makeStyledJsxTag;

var makeSourceMapGenerator = function makeSourceMapGenerator(file) {
  var filename = file.sourceFileName;
  var generator = new _sourceMap.SourceMapGenerator({
    file: filename,
    sourceRoot: file.sourceRoot
  });
  generator.setSourceContent(filename, file.code);
  return generator;
};

exports.makeSourceMapGenerator = makeSourceMapGenerator;

var addSourceMaps = function addSourceMaps(code, generator, filename) {
  var sourceMaps = [_convertSourceMap["default"].fromObject(generator).toComment({
    multiline: true
  }), "/*@ sourceURL=" + filename.replace(/\\/g, '\\\\') + " */"];

  if (Array.isArray(code)) {
    return code.concat(sourceMaps);
  }

  return [code].concat(sourceMaps).join('\n');
};

exports.addSourceMaps = addSourceMaps;
var combinedPluginsCache = {
  plugins: null,
  combined: null
};

var combinePlugins = function combinePlugins(plugins) {
  if (!plugins) {
    return function (css) {
      return css;
    };
  }

  var pluginsToString = JSON.stringify(plugins);

  if (combinedPluginsCache.plugins === pluginsToString) {
    return combinedPluginsCache.combined;
  }

  if (!Array.isArray(plugins) || plugins.some(function (p) {
    return !Array.isArray(p) && typeof p !== 'string';
  })) {
    throw new Error('`plugins` must be an array of plugins names (string) or an array `[plugin-name, {options}]`');
  }

  combinedPluginsCache.plugins = pluginsToString;
  combinedPluginsCache.combined = plugins.map(function (plugin, i) {
    var options = {};

    if (Array.isArray(plugin)) {
      options = plugin[1] || {};
      plugin = plugin[0];

      if (Object.prototype.hasOwnProperty.call(options, 'babel')) {
        throw new Error("\n            Error while trying to register the styled-jsx plugin: " + plugin + "\n            The option name `babel` is reserved.\n          ");
      }
    }

    log('Loading plugin from path: ' + plugin);

    var p = require(plugin);

    if (p["default"]) {
      p = p["default"];
    }

    var type = typeof p;

    if (type !== 'function') {
      throw new Error("Expected plugin " + plugins[i] + " to be a function but instead got " + type);
    }

    return {
      plugin: p,
      options: options
    };
  }).reduce(function (previous, _ref3) {
    var plugin = _ref3.plugin,
        options = _ref3.options;
    return function (css, babelOptions) {
      return plugin(previous ? previous(css, babelOptions) : css, _extends({}, options, {
        babel: babelOptions
      }));
    };
  }, null);
  return combinedPluginsCache.combined;
};

exports.combinePlugins = combinePlugins;

var getPrefix = function getPrefix(isDynamic, id) {
  return isDynamic ? '.__jsx-style-dynamic-selector' : "." + id;
};

var processCss = function processCss(stylesInfo, options) {
  var hash = stylesInfo.hash,
      css = stylesInfo.css,
      expressions = stylesInfo.expressions,
      dynamic = stylesInfo.dynamic,
      location = stylesInfo.location,
      file = stylesInfo.file,
      isGlobal = stylesInfo.isGlobal,
      plugins = stylesInfo.plugins,
      vendorPrefixes = stylesInfo.vendorPrefixes,
      sourceMaps = stylesInfo.sourceMaps;
  var fileInfo = {
    code: file.code,
    sourceRoot: file.opts.sourceRoot,
    filename: file.opts.filename || file.filename
  };
  fileInfo.sourceFileName = file.opts.sourceFileName || file.sourceFileName || // According to https://babeljs.io/docs/en/options#source-map-options
  // filenameRelative = path.relative(file.opts.cwd, file.opts.filename)
  // sourceFileName = path.basename(filenameRelative)
  // or simply
  // sourceFileName = path.basename(file.opts.filename)
  fileInfo.filename && _path["default"].basename(fileInfo.filename);
  var staticClassName = stylesInfo.staticClassName || "jsx-" + hashString(hash);
  var splitRules = options.splitRules;
  var useSourceMaps = Boolean(sourceMaps) && !splitRules;
  var pluginsOptions = {
    location: {
      start: _extends({}, location.start),
      end: _extends({}, location.end)
    },
    vendorPrefixes: vendorPrefixes,
    sourceMaps: useSourceMaps,
    isGlobal: isGlobal,
    filename: fileInfo.filename
  };
  var transformedCss;

  if (useSourceMaps) {
    var generator = makeSourceMapGenerator(fileInfo);
    var filename = fileInfo.sourceFileName;
    transformedCss = addSourceMaps((0, _styleTransform["default"])(isGlobal ? '' : getPrefix(dynamic, staticClassName), plugins(css, pluginsOptions), {
      generator: generator,
      offset: location.start,
      filename: filename,
      splitRules: splitRules,
      vendorPrefixes: vendorPrefixes
    }), generator, filename);
  } else {
    transformedCss = (0, _styleTransform["default"])(isGlobal ? '' : getPrefix(dynamic, staticClassName), plugins(css, pluginsOptions), {
      splitRules: splitRules,
      vendorPrefixes: vendorPrefixes
    });
  }

  if (expressions.length > 0) {
    if (typeof transformedCss === 'string') {
      transformedCss = templateLiteralFromPreprocessedCss(transformedCss, expressions);
    } else {
      transformedCss = transformedCss.map(function (transformedCss) {
        return templateLiteralFromPreprocessedCss(transformedCss, expressions);
      });
    }
  } else if (Array.isArray(transformedCss)) {
    transformedCss = transformedCss.map(function (transformedCss) {
      return t.stringLiteral(transformedCss);
    });
  }

  return {
    hash: dynamic ? hashString(hash + staticClassName) : hashString(hash),
    css: transformedCss,
    expressions: dynamic && expressions
  };
};

exports.processCss = processCss;

var booleanOption = function booleanOption(opts) {
  var ret;
  opts.some(function (opt) {
    if (typeof opt === 'boolean') {
      ret = opt;
      return true;
    }

    return false;
  });
  return ret;
};

exports.booleanOption = booleanOption;

var createReactComponentImportDeclaration = function createReactComponentImportDeclaration(state) {
  var styleModule = typeof state.opts.styleModule === 'string' ? state.opts.styleModule : 'styled-jsx/style';
  return t.importDeclaration([t.importDefaultSpecifier(t.identifier(_constants.STYLE_COMPONENT))], t.stringLiteral(styleModule));
};

exports.createReactComponentImportDeclaration = createReactComponentImportDeclaration;

var setStateOptions = function setStateOptions(state) {
  var vendorPrefixes = booleanOption([state.opts.vendorPrefixes, state.file.opts.vendorPrefixes]);
  state.opts.vendorPrefixes = typeof vendorPrefixes === 'boolean' ? vendorPrefixes : true;
  var sourceMaps = booleanOption([state.opts.sourceMaps, state.file.opts.sourceMaps]);
  state.opts.sourceMaps = Boolean(sourceMaps);

  if (!state.plugins) {
    state.plugins = combinePlugins(state.opts.plugins, {
      sourceMaps: state.opts.sourceMaps,
      vendorPrefixes: state.opts.vendorPrefixes
    });
  }
};

exports.setStateOptions = setStateOptions;

function log(message) {
  console.log('[styled-jsx] ' + message);
}