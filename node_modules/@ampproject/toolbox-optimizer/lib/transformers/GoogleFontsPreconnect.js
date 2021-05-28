/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const {insertAfter, createElement, firstChildByTag} = require('../NodeUtils');
const {findMetaViewport} = require('../HtmlDomHelper');

/**
 * Adds a preconnect instruction to `fonts.gstatic.com` when the Google Fonts CSS
 * is used in the page.
 *
 * The Google Fonts CSS requests fonts `https://fonts.gstatic.com` after it is loaded.
 * Browsers only connect to this domain after the CSS has been downloaded and the CSSOM has been
 * constructed.
 *
 * By preconnecting earlier, the DNS resolution, TCP connection and SSL handshake are performed
 * sooner, saving up to 1 second on regular 3G networks, resulting on the Fonts being loaded
 * earlier.
 *
 * The transformer will only issue the preconnect instruction if Google Fonts is used on the page.
 */
class GoogleFontsPreconnect {
  constructor(config) {
    this.log_ = config.log.tag('GoogleFontsPreconnect');
  }

  transform(root) {
    const html = firstChildByTag(root, 'html');
    if (!html) {
      return;
    }
    const head = firstChildByTag(html, 'head');
    if (!head) {
      return;
    }

    for (let node = head.firstChild; node !== null; node = node.nextSibling) {
      if (this.isGoogleFontsLinkNode_(node)) {
        // Preconnect to fonts.gstatic.com, where the final fonts are downloaded.
        const linkPreconnect = createElement('link', {
          rel: 'dns-prefetch preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        });
        const referenceNode = findMetaViewport(head);
        insertAfter(head, linkPreconnect, referenceNode);
        this.log_.debug(
          'adding <link rel="dns=prefetch preconnect" href="' + linkPreconnect.attribs.href + '">'
        );

        // We only need 1 preconnect, so we can skip the remaining elements and return.
        return;
      }
    }
  }

  isGoogleFontsLinkNode_(node) {
    return (
      node.tagName === 'link' &&
      node.attribs.rel === 'stylesheet' &&
      node.attribs.href.startsWith('https://fonts.googleapis.com')
    );
  }
}

/** @module GoogleFontsPreconnect */
module.exports = GoogleFontsPreconnect;
