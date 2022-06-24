"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _babelPluginMacros = require("babel-plugin-macros");

var _babelExternal = require("./babel-external");

var _utils = require("./_utils");

var _constants = require("./_constants");

var _default = (0, _babelPluginMacros.createMacro)(styledJsxMacro);

exports["default"] = _default;

function styledJsxMacro(_ref) {
  var references = _ref.references,
      state = _ref.state;
  (0, _utils.setStateOptions)(state); // Holds a reference to all the lines where strings are tagged using the `css` tag name.
  // We print a warning at the end of the macro in case there is any reference to css,
  // because `css` is generally used as default import name for 'styled-jsx/css'.
  // People who want to migrate from this macro to pure styled-jsx might have name conflicts issues.

  var cssReferences = []; // references looks like this
  // {
  //    default: [path, path],
  //    resolve: [path],
  // }

  Object.keys(references).forEach(function (refName) {
    // Enforce `resolve` as named import so people
    // can only import { resolve } from 'styled-jsx/macro'
    // or an alias of it eg. { resolve as foo }
    if (refName !== 'default' && refName !== 'resolve') {
      throw new _babelPluginMacros.MacroError("Imported an invalid named import: " + refName + ". Please import: resolve");
    } // Start processing the references for refName


    references[refName].forEach(function (path) {
      // We grab the parent path. Eg.
      // path -> css
      // path.parenPath -> css`div { color: red }`
      var templateExpression = path.parentPath; // templateExpression member expression?
      // path -> css
      // path.parentPath -> css.resolve

      if (templateExpression.isMemberExpression()) {
        // grab .resolve
        var tagPropertyName = templateExpression.get('property').node.name; // Member expressions are only valid on default imports
        // eg. import css from 'styled-jsx/macro'

        if (refName !== 'default') {
          throw new _babelPluginMacros.MacroError("Can't use named import " + path.node.name + " as a member expression: " + path.node.name + "." + tagPropertyName + "`div { color: red }` Please use it directly: " + path.node.name + "`div { color: red }`");
        } // Otherwise enforce `css.resolve`


        if (tagPropertyName !== 'resolve') {
          throw new _babelPluginMacros.MacroError("Using an invalid tag: " + tagPropertyName + ". Please use " + templateExpression.get('object').node.name + ".resolve");
        } // Grab the TaggedTemplateExpression
        // i.e. css.resolve`div { color: red }`


        templateExpression = templateExpression.parentPath;
      } else {
        if (refName === 'default') {
          var name = path.node.name;
          throw new _babelPluginMacros.MacroError("Can't use default import directly eg. " + name + "`div { color: red }`. Please use " + name + ".resolve`div { color: red }` instead.");
        }

        if (path.node.name === 'css') {
          // If the path node name is `css` we push it to the references above to emit a warning later.
          cssReferences.push(path.node.loc.start.line);
        }
      } // Finally transform the path :)


      (0, _babelExternal.processTaggedTemplateExpression)({
        type: 'resolve',
        path: templateExpression,
        file: state.file,
        splitRules: typeof state.opts.optimizeForSpeed === 'boolean' ? state.opts.optimizeForSpeed : process.env.NODE_ENV === 'production',
        plugins: state.plugins,
        vendorPrefixes: state.opts.vendorPrefixes,
        sourceMaps: state.opts.sourceMaps
      });

      if (!state.hasInjectedJSXStyle && !path.scope.hasBinding(_constants.STYLE_COMPONENT)) {
        state.hasInjectedJSXStyle = true;
        var importDeclaration = (0, _utils.createReactComponentImportDeclaration)(state);
        path.findParent(function (p) {
          return p.isProgram();
        }).node.body.unshift(importDeclaration);
      }
    });
  });

  if (cssReferences.length > 0) {
    console.warn("styled-jsx - Warning - We detected that you named your tag as `css` at lines: " + cssReferences.join(', ') + ".\n" + 'This tag name is usually used as default import name for `styled-jsx/css`.\n' + 'Porting macro code to pure styled-jsx in the future might be a bit problematic.');
  }
}