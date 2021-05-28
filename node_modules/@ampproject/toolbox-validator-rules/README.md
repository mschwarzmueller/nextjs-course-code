# AMP-Toolbox Validator Rules

[![npm version](https://badge.fury.io/js/%40ampproject%2Ftoolbox-validator-rules.svg)](https://badge.fury.io/js/%40ampproject%2Ftoolbox-validator-rules)

Queries published AMP Validator rules and extracts information about required
markup and attributes for all AMP formats.

## Usage

Install via:

```
$ npm install @ampproject/toolbox-validator-rules
```

### Including the Module

#### ES Module (Browser)

```javascript
import validatorRules from '@ampproject/toolbox-validator-rules';
```

#### CommonJs (Node)

```javascript
const validatorRules = require('@ampproject/toolbox-validator-rules');
```

### Using the module

```javascript
  // Loads the validator rules remotely with default options
  const rules = await validatorRules.fetch();


  // The raw unprocessed rules
  console.log(rules.raw);

  // All tags, combined with their respective attribute lists
  console.log(rules.tags);

  // All extensions
  console.log(rules.extensions);

  // Get all tag names used in AMP for Email
  // The supported formats are AMP, AMP4EMAIL, AMP4ADS and ACTIONS
  const tags = rules.getTagsForFormat('AMP4EMAIL');

  // Display their names
  console.log(tags.map(tag => tag.tagName));

  // Get information about an extension
  const ext = rules.getExtension('AMP4EMAIL', 'amp-carousel');

  // Display supported versions
  console.log(ext.versions);
```

### Format of rules

The rules used closely follow the proto definitions from [validator.proto](https://github.com/ampproject/amphtml/blob/master/validator/validator.proto).

Specifically:

-   The `raw` property is unprocessed [ValidatorRules](https://github.com/ampproject/amphtml/blob/master/validator/validator.proto#L643), the same format used by `https://cdn.ampproject.org/v0/validator.json`
-   The result of `getTagsForFormat` and the `tags` property is a list of [TagSpec](https://github.com/ampproject/amphtml/blob/b892d81467594cab5473c803e071af5108f834a6/validator/validator.proto#L463)
-   The result of `getExtension` is [ExtensionSpec](https://github.com/ampproject/amphtml/blob/b892d81467594cab5473c803e071af5108f834a6/validator/validator.proto#L388) with the `htmlFormat` field from `TagSpec`
-   The `extensions` property a list of [ExtensionSpec](https://github.com/ampproject/amphtml/blob/b892d81467594cab5473c803e071af5108f834a6/validator/validator.proto#L388) with the `htmlFormat` field from `TagSpec`
-   The `errors` property combines [ErrorFormat](https://github.com/ampproject/amphtml/blob/b892d81467594cab5473c803e071af5108f834a6/validator/validator.proto#L874) and [ErrorSpecificity](https://github.com/ampproject/amphtml/blob/b892d81467594cab5473c803e071af5108f834a6/validator/validator.proto#L869)

### Options

`fetch` optionally accepts an options object allowing you to customize its
behaviour.

The following options are supported:

   * `noCache`: true to always fetch latest rules (by default, subsequent calls to `fetch` reuse the same result).
   * `rules`: object to use locally specified rules instead of fetching them from the AMP CDN.
   * `url`: override the URL where validator rules are fetched from.
   * `source`: one of `'local'` (load rules from local file named "validator.json"), `'remote'` (fetch rules from CDN) or `'auto'` which is the default (tries looking for the local file first, then tries to fetch from CDN).

Example:

```
validatorRules.fetch({
  noCache: true,
  source: 'remote'
});
```
