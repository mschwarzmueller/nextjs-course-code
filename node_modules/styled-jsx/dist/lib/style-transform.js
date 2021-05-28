"use strict";

var Stylis = require('stylis');

var stylisRuleSheet = require('stylis-rule-sheet');

var stylis = new Stylis();

function disableNestingPlugin() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  var context = args[0],
      _args$ = args[3],
      parent = _args$ === void 0 ? [] : _args$,
      line = args[4],
      column = args[5];

  if (context === 2) {
    // replace null characters and trim
    // eslint-disable-next-line no-control-regex
    parent = (parent[0] || '').replace(/\u0000/g, '').trim();

    if (parent.length > 0 && parent.charAt(0) !== '@') {
      throw new Error("Nesting detected at " + line + ":" + column + ". " + 'Unfortunately nesting is not supported by styled-jsx.');
    }
  }
}

var generator;
var filename;
var offset;

function sourceMapsPlugin() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
  var context = args[0],
      line = args[4],
      column = args[5],
      length = args[6]; // Pre-processed, init source map

  if (context === -1 && generator !== undefined) {
    generator.addMapping({
      generated: {
        line: 1,
        column: 0
      },
      source: filename,
      original: offset
    });
    return;
  } // Post-processed


  if (context === -2 && generator !== undefined) {
    generator = undefined;
    offset = undefined;
    filename = undefined;
    return;
  } // Selector/property, update source map


  if ((context === 1 || context === 2) && generator !== undefined) {
    generator.addMapping({
      generated: {
        line: 1,
        column: length
      },
      source: filename,
      original: {
        line: line + offset.line,
        column: column + offset.column
      }
    });
  }
}
/**
 * splitRulesPlugin
 * Used to split a blob of css into an array of rules
 * that can inserted via sheet.insertRule
 */


var splitRules = [];
var splitRulesPlugin = stylisRuleSheet(function (rule) {
  splitRules.push(rule);
});
stylis.use(disableNestingPlugin);
stylis.use(sourceMapsPlugin);
stylis.use(splitRulesPlugin);
stylis.set({
  cascade: false,
  compress: true
});
/**
 * Public transform function
 *
 * @param {String} hash
 * @param {String} styles
 * @param {Object} settings
 * @return {string}
 */

function transform(hash, styles, settings) {
  if (settings === void 0) {
    settings = {};
  }

  generator = settings.generator;
  offset = settings.offset;
  filename = settings.filename;
  splitRules = [];
  stylis.set({
    prefix: typeof settings.vendorPrefixes === 'boolean' ? settings.vendorPrefixes : true
  });
  stylis(hash, styles);

  if (settings.splitRules) {
    return splitRules;
  }

  return splitRules.join('');
}

module.exports = transform;