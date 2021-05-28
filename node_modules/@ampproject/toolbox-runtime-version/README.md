# AMP Runtime Version

[![npm version](https://badge.fury.io/js/%40ampproject%2Ftoolbox-runtime-version.svg)](https://badge.fury.io/js/%40ampproject%2Ftoolbox-runtime-version)

Use it to query `cdn.ampproject.org` for the current release or canary version of the AMP Runtime. Uses a stale-while-revalidate caching strategy to avoid network requests in the critical path.

You can use the API to re-write AMP runtime URLs to their versioned counter parts to improve browser caching, e.g. to replace:

```
https://cdn.ampproject.org/v0.css
```

with:

```
https://cdn.ampproject.org/rtv/001515617716922/v0.css
```


## Installation

Install via:

```sh
npm install @ampproject/toolbox-runtime-version
```

## Usage

Basic usage:

```js
const runtimeVersion = require('@ampproject/toolbox-runtime-version');

// Release version
runtimeVersion.currentVersion().then(version => {
  console.log(version);
});

// Canary version
runtimeVersion.currentVersion({canary: true}).then(version => {
  console.log(version);
});

// Rewriting cache URLs
const ampRuntimeUrl = 'https://cdn.ampproject.org/v0.js';
const version = await runtimeVersion.currentVersion();
const versionedAmpRuntimeUrl = ampRuntimeUrl.replace(
  'https://cdn.ampproject.org/',
  'https://cdn.ampproject.org/rtv/' + version + '/'
);
console.log(versionedAmpRuntimeUrl);
```

