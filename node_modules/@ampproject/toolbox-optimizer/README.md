# AMP Optimizer

[![npm version](https://badge.fury.io/js/%40ampproject%2Ftoolbox-optimizer.svg)](https://badge.fury.io/js/%40ampproject%2Ftoolbox-optimizer)

AMP Optimizer is a tool to simplify creating AMP pages and improve AMP rendering performance. AMP Optimizer implements [AMP performance best practices](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp?format=websites) and supports [AMP server-side-rendering](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/server-side-rendering?format=websites). By default, it will perform the following optimizations:

- [Server-side render AMP layouts](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/server-side-rendering/).
- **Automatically import all missing AMP component scripts**.
- **Automatically add any missing mandatory AMP tags**.
- Auto detects and preloads hero images from amp-img, amp-iframe, amp-video, or amp-video-iframe.
- Remove the AMP boilerplate (when possible).
- Remove not needed whitespace.
- Extract and move CSS keyframe animations to the bottom of the page.
- Optimize AMP framework and custom font loading
- Generate CSP for inlined [`amp-script`](https://amp.dev/documentation/components/amp-script/) code.

The performance optimizations can improve page rendering times by up to 50%. You can read more about the potential performance gains in this [blog post](https://blog.amp.dev/2018/10/08/how-to-make-amp-even-faster/). To give it a try, check out [the online playground](https://toolbox-optimizer.glitch.me/).

**Good to know:**

- AMP Optimizer will produce valid AMP.
- AMP Optimizer can be used in combination with [AMP Packager](https://github.com/ampproject/amppackager) to create SXGs.

## Usage

### API

Install via:

```
npm install @ampproject/toolbox-optimizer
```

Minimal usage:

```js
const AmpOptimizer = require('@ampproject/toolbox-optimizer');

const ampOptimizer = AmpOptimizer.create();

const originalHtml = `
<!doctype html>
<html ⚡>
  ...
</html>`;

ampOptimizer.transformHtml(originalHtml).then(optimizedHtml => {
  console.log(optimizedHtml);
});
```

You can find a sample implementation [here](/packages/optimizer/demo/simple). If you're using express to serve your site, you can use the [AMP Optimizer Middleware](/packages/optimizer-express).

### CLI

AMP Optimizer can be used via the [AMP Toolbox CLI](/packages/cli/README.md):

```shell
npm install @ampproject/toolbox-cli -g
amp optimize myFile.html
```

or run without installation via `npx`:

```shell
npx @ampproject/toolbox-cli optimize myFile.html
```

### Options

Options are passed when creating a new AMP Optimizer instance:

```js
const ampOptimizer = AmpOptimizer.create({
  verbose: true
});
...
```

Available options are:

- [autoAddMandatoryTags](#autoaddmandatorytags)
- [autoExtensionImport](#autoextensionimport)
- [extensionVersions](#extensionversions)
- [fetch](#fetch)
- [format](#format)
- [imageBasePath](#imagebasePath)
- [imageOptimizer](#imageoptimizer)
- [lts](#lts)
- [markdown](#markdown)
- [minify](#minify)
- [preloadHeroImage](#preloadheroimage)
- [verbose](#verbose)

#### `autoAddMandatoryTags`

Automatically inject any missing markup required by AMP.

- name: `autoAddMandatoryTags`
- valid options: `[true|false]`
- default: `true`
- used by: [AddMandatoryTags](lib/transformers/AddMandatoryTags.js)

#### `autoExtensionImport`

Automatically import any missing AMP Extensions (e.g. amp-carousel).

- name: `autoExtensionImport`
- valid options: `[true|false]`
- default: `true`
- used by: [AutoExtensionImport](lib/transformers/AutoExtensionImporter.js)

#### `extensionVersions`

Specify version numbers to use for automatically imported Extensions. If not defined, default to latest.

Example:

```js
const ampOptimizer = AmpOptimizer.create({
  extensionVersions: {
    "amp-twitter": "0.1"
  }
});
```

- name: `extensionVersions`
- valid options: `OBJECT`
- default: `{}`
- used by: [AutoExtensionImport](lib/transformers/AutoExtensionImporter.js)

#### `format`

Specifies the AMP format of the input file. Defaults to `AMP`.

- name: `format`
- valid options: `[AMP|AMP4EMAIL|AMP4ADS]`
- default: `AMP`
- used by: [AutoExtensionImport](lib/transformers/AutoExtensionImporter.js), [AddMandatoryTags](lib/transformers/AddMandatoryTags.js)

#### `experimentEsm`

Enable [JavaScript Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) support for AMP runtime and components. AMP Optimizer will generate module/nonmodule script imports for AMP runtime and components:

```
<script async nomodule src="https://cdn.ampproject.org/v0.js"></script>
<script async src="https://cdn.ampproject.org/v0.mjs" type="module" crossorigin="anonymous"></script>
```

**Warning: this will result in invalid AMP pages.**

- name: `experimentEsm`
- valid options: `[true|false]`
- default: `false`
- used by: [RewriteAmpUrls](lib/transformers/RewriteAmpUrls.js)

#### `imageBasePath`

Specifies a base path used to resolve an image during build,
this can be a file system path or URL prefix. You can also pass a function
`(imgSrc, params) => '../img/' + imgSrc` for dynamically calculating the image path.

- name: `imageBasePath`
- valid options: `STRING|FUNCTION`
- default: undefined
- used by: [Markdown](lib/transformers/Markdown.js)

#### `imageOptimizer`

Enable automated image `srcset` generation by providing a function for calculating `srcset` URLs for a given image `src`. The function should return a URL pointing to a version of the `src` image with the given `width`. If no image is available, it should return a falsy value.

Example:

```js
const ampOptimizer = AmpOptimizer.create({
  imageOptimizer: (src, width) => `${src}?width=${width}`
});
```

- name: `imageOptimizer`
- valid options: `FUNCTION`
- default: undefined
- used by: [OptimizeImages](lib/transformers/OptimizeImages.js)

#### `lts`

Use [long-term stable URLs](https://github.com/ampproject/amphtml/blob/main/contributing/lts-release.md) for downloading the AMP runtime and components.

- name: `lts`
- valid options: `[true|false]`
- default: `false`
- used by: [RewriteAmpUrls](lib/transformers/RewriteAmpUrls.js)

#### `markdown`

This transformer adds out-of-the-box markdown support. This allows
using AMP Optimizer to convert HTML documents created from Markdown
files into valid AMP. A typical conversion flow would be:

README.md => HTML => AMP Optimizer => valid AMP

The only thing this transformer does is converting `<img>` tags into
either `amp-img` or `amp-anim` tags. All other Markdown features are
already supported by AMP. The transformer will try to resolve image
dimensions from the actual files. Images larger than 320px will automatically
get an intrinsic layout. For image detection to work, an optional dependency
`probe-image-size` needs to be installed via NPM.

- name: `markdown`
- valid options: `[true|false]`
- default: `false`
- used by: [Markdown](lib/transformers/Markdown.js)

#### `minify`

Minifies the generated HTML output and inlined CSS.

- name: `minify`
- valid options: `[true|false]`
- default: `true`
- used by: [MinifyHtml](lib/transformers/MinifyHtml.js), [SeparateKeyframes](lib/transformers/SeparateKeyframes.js)

#### `preloadHeroImage`

Enables hero image optimization. Hero images will either be auto detected or you can explicitly mark these by adding the `data-hero` attribute:

```
<amp-img data-hero src="foo.jpg" ...>
```

The maximum number of hero images that can be marked up using `data-hero` is `2`.

If no `data-hero` attribute is present, AMP optimizer auto-detects hero images for `amp-img`, `amp-iframe`, `amp-video`, or `amp-video-iframe` and injects a `link rel=preload`. Image preload links will only be generated if there is none already existing. For `amp-img` elements, it will also server-side render the `img` element inside the `amp-img` element. This greatly improves image rendering performance and reduces the [largest contentful paint](https://web.dev/lcp/) (LCP) metric from [Core Web Vitals](https://web.dev/vitals/).

- name: `preloadHeroImage`
- valid options: `[true|false]`
- default: `true`
- used by: [PreloadHeroImage](lib/transformers/PreloadHeroImage.js)

#### `verbose`

Enable verbose mode with more detailed logging output.

- name: `verbose`
- valid options: `[true|false]`
- default: `false`

## Features

### Image optimization

AMP Optimizer helps you serve optimized images. For this to work, you need to provide a function that maps an image `src` to a resized `srcset` source value. The image resizing needs to either happen at build time (e.g. for static sites) or via a image hosting service such as [thumbor](https://github.com/thumbor/thumbor).

Here is an example implementation that appends the image width to the `src`:

```js
const ampOptimizer = AmpOptimizer.create({
  // parameters are the amp-img `src` and the `width` of the to be generated srcset source value
  imageOptimizer: (src, width) => {
    // we cannot rename if the image does not have a file extension
    const index = src.lastIndexOf('.');
    if (index === -1) {
      // return null means we won't generate a srcset source value for this width
      return null;
    }
    const prefix = src.substring(0, index);
    const postfix = src.substring(index, src.length);
    return `${prefix}.${width}w${postfix}`;
  };
})
```

Using this implementation, AMP Optimizer will transform the following `amp-img` declarations:

```html
<!-- Injects srcset for responsive layout -->
<amp-img src="image1.png" width="400" height="800" layout="responsive"></amp-img>
<!-- Ignores existing srcset -->
<amp-img layout=fill srcset="image-1x.png 1x,
                             image-2x.png 2x"></amp-img>
```

into:

```html
<!-- Injects srcset for responsive layout -->
<amp-img src="image1.png" width="400" height="800" layout="responsive" srcset="image1.470w.png 470w, image1.820w.png 820w, image1.1440w.png 1440w"></amp-img>
<!-- Ignores existing srcset -->
<amp-img layout="fill" srcset="image-1x.png 1x,
                               image-2x.png 2x"></amp-img>
```

**Important** when using `layout=responsive` use the `width` and `height` attribute to specify the minimum image dimensions. For example, for a full-bleed hero image on mobile, specify the width as`width=320`.

### Auto add incomplete markup

It's possible to pass incomplete documents and AMP Optimizer will add any
missing tags and extension imports required by a valid AMP document.

```js
const originalHtml = `
  <h1>Hello World!</h1>
  <amp-twitter width="375"
               height="472"
               layout="responsive"
               data-tweetid="1182321926473162752">
  </amp-twitter>
`;

// you can pass the canonical URL, default is `.`
const opts = {
  canonical: '/example.html'
}
ampOptimizer.transformHtml(originalHtml, opts).then((optimizedHtml) => {
  // optimizedHtml will be a valid AMP document
  console.log(optimizedHtml);
});
```

### Automated Markdown conversion

AMP Optimizer supports converting Markdown to AMPHTML. A typical conversion flow would be:

```
README.md => HTML => AMP Optimizer => valid AMP
```

The AMP Optimizer converts `<img>` tags into `<amp-img>` or `<amp-anim>` tags when in Markdown mode. Enable Markdown mode via `markdown : true`. AMP Optimizer will try to resolve image dimensions from the actual files. Images wider than 320px will automatically get an `intrinsic` layout.

All other Markdown features are already supported by AMP.

You can pass an additional option `imageBasePath` to specify a base path used to resolve an image during build, this can be a file system path or URL prefix.

**Important:** for image size detection to work, an optional dependency
`probe-image-size` needs to be installed via NPM.

```shell
npm install probe-image-size --save-dev
```

Example:

```js
const AmpOptimizer = require('@ampproject/toolbox-optimizer');
const md = require('markdown-it')({
  // don't sanitize html if you want to support AMP components in Markdown
  html: true,
});

// enable markdown mode
const ampOptimizer = AmpOptimizer.create({
  markdown: true,
});

const markdown = `
# Markdown 🤯

Here is an image declared in Markdown syntax:

![A random image](https://unsplash.it/800/600).

You can directly declare AMP components:

<amp-twitter width="375"
             height="472"
             layout="responsive"
             data-tweetid="1182321926473162752">
</amp-twitter>

Any missing extensions will be automatically imported.
`;

const html = md.render(markdown);

const amphtml = await ampOptimizer.transformHtml(html, {
  canonical: filePath,
});
```

You can find a working sample [here](/packages/optimizer/demo/markdown).

## Extending AMP Optimizer with custom transformations

AMP Optimizer supports custom HTML transformations:

```js
const AmpOptimizer = require('@ampproject/toolbox-optimizer');
const {createElement, firstChildByTag, appendChild} = AmpOptimizer.NodeUtils;

class CustomTransformer {
  constructor(config) {
    this.log_ = config.log.tag('CUSTOM');
  }
  transform(tree, params) {
    this.log_.info('Running custom transformation for ', params.filePath);
    const html = firstChildByTag(tree, 'html');
    if (!html) return;
    const head = firstChildByTag(html, 'head');
    if (!head) return;
    const desc = createElement('meta', {
      name: 'description',
      content: 'this is just a demo',
    });
    appendChild(head, desc);
  }
}

// it's best to run custom transformers first
const customTransformations = [CustomTransformer, ...AmpOptimizer.TRANSFORMATIONS_AMP_FIRST];

// pass custom transformers when creating the optimizer
const optimizer = AmpOptimizer.create({
  transformations: customTransformations,
});
// you can add custom parameters on a per document basis
const transformedHtml = await optimizer.transformHtml(html, {
  filePath,
});
```

Checkout [the samples](/packages/optimizer/demo/simple/index.js) to learn how to customize AMP Optimizer.

## Best Practices

### Make sure to enable AMP Boilerplate removal

The biggest performance gain results from [removing the AMP boilerplate code](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/server-side-rendering/#why-is-it-faster?). However, under some circumstances it's not possible to remove the boilerplate code:

- if the`amp-experiment`, `amp-story` or `amp-dynamic-css-classes` components are used ([code](https://github.com/ampproject/amphtml/blob/62a9eab084ccd800d80a371e2cb29cd4f9e8576a/src/render-delaying-services.js#L39-L43)).

To find out, why the AMP boilerplate could not be removed, enable `verbose` mode:

```js
// globally
const optimizer = ampOptimizer.create({
  verbose: true
} );
```

... or for individual pages:

```js
// per transformation
ampOptimizer.transformHtml(originalHtml, {
  verbose: true
})
```

### Transform AMP pages at build time if possible

Applying the transformations to an AMP file consumes additional server resources. Also, since the entire file is needed to apply the transformations, it also becomes impossible to stream the response while applying it. In order to avoid server overhead, if the set of AMP files to be transformed is known in advance, transformations should be run at build time.

### Cache transformed AMPs at runtime

Most websites have a more dynamic nature though and are not able to apply the transformations statically. For such cases it is possible to run the transformations after AMP pages are rendered, e.g. in an Express middleware. In that case, to achieve best performance, it's best to cache transformed pages for subsequent requests. Caching can take place on the CDN level, on the site's internal infrastructure (eg: Memcached), or even on the server itself, if the set of pages is small enough to fit in memory.

### Regenerate pages at least once a week

AMP Optimizer inlines CSS styles required by AMP. To make sure, that the inlined CSS stays in sync with the latest AMP release, we recommend to re-generate pages at least once a weekOut-of-sync CSS will not break your page, but it could theoretically cause AMP components to briefly appear with the "wrong" styles, such as being visible when they should be hidden. The good news is that these glitches will only be temporary, because as soon as the AMP JS starts, it will check the inlined CSS and update it if required.

## Experimental Features

**Warning: these features are experimental and might result in invalid AMP pages.**

### Paired AMP

When using experimental features resulting in invalid AMP it's best to setup paired AMP mode. Paired AMP mode will add `<link rel=amphtml href=${ampUrl}>` to the transformed page, were `ampUrl` needs to point to the valid version of this page.

Example:

```js
const optimizer = AmpOptimizer.create({
  transformations: AmpOptimizer.TRANSFORMATIONS_PAIRED_AMP,
});
const ampFilePath = filePath.substring(1, filePath.length)
    .replace('.html', '.amp.html');
const transformedHtml = await optimizer.transformHtml(html, {
  // needed to calculate the `<link rel=amphtml href=${ampUrl}>`
  ampUrl: ampFilePath,
});
```

### Versioned AMP Runtime

The `ampRuntimeVersion` parameter will rewrite all AMP runtime and extension imports to the specified version. For example:

```
https://cdn.ampproject.org/v0.js
```

will be replaced with:

```
https://cdn.ampproject.org/rtv/001515617716922/v0.js
```

Versioning the AMP runtime URLs has one main benefit: versioned AMP runtime URLs are served with a longer max-age than the unversioned ones. This means AMP pages served with versioned AMP runtime benefit from better browser caching.

**Important:** when using versioned AMP runtime URLs make sure to invalidate all caches whenever a new AMP runtime is released. This is to ensure that your AMP pages always use the latest version of the AMP runtime.

You can use [@ampproject/toolbox-runtime-version](/packages/runtime-version) to retrieve the latest version of the AMP runtime. Here is a sample to apply the optimizations including versioning the URLs:

```js
const ampOptimizer = require('@ampproject/toolbox-optimizer');
const ampRuntimeVersion = await runtimeVersion.currentVersion();

// The input string
const originalHtml = `
<!doctype html>
<html ⚡>
...
`

// Additional options can be passed as the second argument
const optimizedHtml = await ampOptimizer.transformHtml(originalHtml, {
  ampUrl: 'canonical.amp.html',
  ampRuntimeVersion: ampRuntimeVersion
});

console.log(optimizedHtml);
```

### Blurry image placeholders

Add placeholders for `amp-img` and `amp-video` posters. The placeholders are blurry versions of the corresponding original source. The blur will be displayed as the `<amp-img>` is rendering, and will fade out once the element is loaded. The current requirements of appending a blurry placeholder is for the element is to be a JPEG that is either responsive or a poster for an `amp-video`.

**Important: blurry image placeholder computation is computationally expensive. Make sure to only use it for static or cached pages.**

This transformer supports the following options:

- `blurredPlaceholders`: Enables blurry image placeholder generation. Default is `false`.
- `imageBasePath`: specifies a base path used to resolve an image during build.
- `maxBlurredPlaceholders`: Specifies the max number of blurred images. Defaults to 5.
- `blurredPlaceholdersCacheSize`: Specifies the max number of blurred images to be cached
  to avoid expensive recalculation. Set to 0 if caching should be disabled. Set to -1 if
  all placeholders should be cached (good for static sites). Defaults to 30.

Usage:

```js
const optimizer = AmpOptimizer.create({
  // blurry image placeholders are currently not considered valid AMP
  // hence it's recommended to setup paired AMP mode when enabling this feature.
  transformations: AmpOptimizer.TRANSFORMATIONS_PAIRED_AMP,
  blurredPlaceholders: true,
});
```

### Self-hosted AMP components

It's possible to rewrite the AMP framework and component imports to a different domain than `cdn.ampproject.org`.

Example:

```js
const ampOptimizer = require('@ampproject/toolbox-optimizer');

// The input string
const originalHtml = `
<!doctype html>
<html ⚡>
...
`

// Additional options can be passed as the second argument
const optimizedHtml = await ampOptimizer.transformHtml(originalHtml, {
  ampUrl: 'canonical.amp.html',
  // this will rewrite https://cdn.ampproject.org/v0.js to /amp/v0.js
  ampUrlPrefix: '/amp'
});

console.log(optimizedHtml);
```

### Fallback API for amp-geo

Ideally, when self-hosting the AMP framework, `amp-geo-0.1.js` should be patched at delivery time to replace `{{AMP_ISO_COUNTRY_HOTPATCH}}` with the ISO 3166-1 alpha-2 country code where the request originated ([reference](https://github.com/ampproject/amphtml/blob/main/spec/amp-cache-guidelines.md#guidelines-adding-a-new-cache-to-the-amp-ecosystem)). If your host does not have this capability, you can instead rely on a web API to return the country at runtime. The web API must be secure (HTTPS), adhere to [AMP CORS guidelines](https://amp.dev/documentation/guides-and-tutorials/learn/amp-caches-and-cors/amp-cors-requests/), and return JSON in the following format:

```js
{"country": "de"}
```

where in this example, `de` is the ISO 3166-1 alpha-2 country code for Germany.

Example:

```js
const ampOptimizer = require('@ampproject/toolbox-optimizer');

// The input string
const originalHtml = `
<!doctype html>
<html ⚡>
...
`;

const optimizedHtml = await ampOptimizer.transformHtml(originalHtml, {
  // this will instruct amp-geo to fetch the user's country from an API
  // which returns JSON in format: {"country": "de"}
  geoApiUrl: 'https://example.com/geo'
});

console.log(optimizedHtml);
```

## Development & Testing

AMP Optimizer uses a snapshot based testing approach. To execute the tests, run in the project root:

```shell
npm run test:node
```

Transformer tests are located in:

```
- spec/transformers/valid/TransformerName/test-name/
    expected_output.html
    input.html
```

The transformation input is defined in `input.html`, whereas `expected_output.html` contains the expected
outcome of the transformation. Don't edit `expected_output.html` manually, instead, after changing
a transformer implementation, run:

```shell
npm run test:optimizer:snapshot
```

to store a new snapshot version in `expected_output.html`.
