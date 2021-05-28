"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _babelPluginSyntaxJsx = _interopRequireDefault(require("babel-plugin-syntax-jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default() {
  return {
    inherits: _babelPluginSyntaxJsx["default"],
    visitor: {
      JSXOpeningElement: function JSXOpeningElement(path) {
        var el = path.node;

        var _ref = el.name || {},
            name = _ref.name;

        if (name !== 'style') {
          return;
        }

        el.attributes = el.attributes.filter(function (a) {
          var name = a.name.name;
          return name !== 'jsx' && name !== 'global';
        });
      }
    }
  };
}